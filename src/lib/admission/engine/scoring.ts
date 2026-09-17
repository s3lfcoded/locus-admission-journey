import { achievementPriority } from '../types/applicant';
import type { ApplicantProfile } from '../types/applicant';
import {
  COUNTRY_TITLES, LANGUAGE_TITLES, RELATED_FIELDS, STUDY_FIELD_TITLES,
  type Institution, type Program, type StudyField,
} from '../types/institution';
import { formatMoney, toUsd, type FxRates } from '../types/money';
import { needsVerification } from '../types/sources';
import type { MatchFactors, MatchResult, OpenTrack } from '../types/match';
import { CHANCE_LEVEL_TITLES, estimateTrackChance } from './chance';
import { checkPreferences, evaluateTrack } from './eligibility';
import { clamp01, DEFAULT_WEIGHTS, type MatchWeights } from './weights';

/** Ниже этой вероятности бесплатная траектория перестаёт быть реалистичной целью. */
const HOPELESS_THRESHOLD = 0.15;

function scoreFieldMatch(preferred: readonly StudyField[], programFields: readonly StudyField[]): number {
  if (preferred.length === 0) return 0.5;
  const wanted = new Set(preferred);
  if (programFields.some((field) => wanted.has(field))) return 1;
  const related = new Set(preferred.flatMap((field) => RELATED_FIELDS[field]));
  if (programFields.some((field) => related.has(field))) return 0.6;
  return 0.2;
}

function scoreLanguage(profile: ApplicantProfile, program: Program): number {
  const wanted = profile.preferences.languages;
  if (wanted.length === 0) return 0.7;
  return program.languages.some((lang) => wanted.includes(lang)) ? 1 : 0;
}

function scoreLocation(profile: ApplicantProfile, institution: Institution): number {
  const { countries, cities, willingToRelocate } = profile.preferences;
  const countryOk = countries.length === 0 || countries.includes(institution.country);
  const cityOk = cities.length === 0 || cities.includes(institution.city);
  if (countryOk && cityOk) return 1;
  if (countryOk) return willingToRelocate ? 0.6 : 0.2;
  return willingToRelocate ? 0.3 : 0;
}

function scorePrestige(institution: Institution): number {
  const rank = institution.qsWorldRank;
  if (rank === null) return 0.4;
  // Шкала логарифмическая: разница между 50-м и 150-м местом важнее, чем между 900-м и 1000-м.
  return clamp01(1 - Math.log10(rank) / 3.2);
}

function scoreAffordability(
  profile: ApplicantProfile,
  program: Program,
  openTracks: readonly OpenTrack[],
  fx?: FxRates,
): number {
  const freeChance = openTracks
    .filter((entry) => entry.track.fundingType !== 'paid')
    .reduce((best, entry) => Math.max(best, entry.chance.probability ?? 0.3), 0);
  if (freeChance >= 0.5) return 1;

  const tuition = program.tuitionPerYear;
  if (tuition === null) return freeChance;

  const limit = profile.preferences.maxTuitionPerYear;
  if (limit === null) return 0.7;

  const limitUsd = toUsd(limit, fx);
  const tuitionUsd = toUsd(tuition, fx);
  if (limitUsd <= 0) return tuitionUsd === 0 ? 1 : 0;
  if (tuitionUsd <= limitUsd) return clamp01(1 - 0.3 * (tuitionUsd / limitUsd));
  return clamp01((limitUsd / tuitionUsd) * 0.6);
}

function buildNarrative(
  profile: ApplicantProfile,
  program: Program,
  institution: Institution,
  openTracks: readonly OpenTrack[],
): { reasons: string[]; warnings: string[] } {
  const reasons: string[] = [];
  const warnings: string[] = [];

  const best = openTracks[0];
  if (best !== undefined) {
    const { chance, track } = best;
    if (chance.margin !== null && chance.passingScore !== null) {
      const verb = chance.margin >= 0 ? 'выше' : 'ниже';
      const line = `${track.title.ru}: ${best.applicantScore} баллов — на ${Math.abs(chance.margin)} ${verb} проходного ${chance.passingScore}`;
      if (chance.margin >= 0) reasons.push(line);
      else warnings.push(line);
    } else {
      warnings.push(`${track.title.ru}: проходной балл не публиковался, шансы оценить нечем`);
    }
    reasons.push(`Доступных траекторий поступления: ${openTracks.length} · ${CHANCE_LEVEL_TITLES[chance.level].toLowerCase()}`);
  }

  const matched = program.fields.filter((field) => profile.preferences.fields.includes(field));
  if (matched.length > 0) {
    reasons.push(`Совпадает с интересами: ${matched.map((f) => STUDY_FIELD_TITLES[f]).join(', ')}`);
  }

  if (profile.preferences.countries.includes(institution.country)) {
    reasons.push(`${COUNTRY_TITLES[institution.country]}, ${institution.city} — из выбранных`);
  } else if (profile.preferences.countries.length > 0) {
    warnings.push(`Другая страна: ${COUNTRY_TITLES[institution.country]}`);
  }

  const wantedLanguages = profile.preferences.languages;
  if (wantedLanguages.length > 0 && program.languages.some((l) => wantedLanguages.includes(l))) {
    reasons.push(`Обучение на языке: ${program.languages.filter((l) => wantedLanguages.includes(l)).map((l) => LANGUAGE_TITLES[l]).join(', ')}`);
  }

  if (program.tuitionPerYear !== null) {
    reasons.push(`Стоимость: ${formatMoney(program.tuitionPerYear)} в год`);
  }

  if (institution.qsWorldRank !== null && institution.qsWorldRank <= 500) {
    reasons.push(`${institution.shortName} — ${institution.qsWorldRank}-е место в QS World`);
  }

  if (needsVerification(program.provenance)) {
    warnings.push(
      program.provenance.caveat ??
        'Цифры по этой программе не подтверждены официальным источником — сверьте с приёмной комиссией',
    );
  }

  return { reasons, warnings };
}

/** Скоринг программы: перебирает все траектории поступления и берёт лучшую. */
export function scoreProgram(
  profile: ApplicantProfile,
  entry: { program: Program; institution: Institution },
  weights: MatchWeights = DEFAULT_WEIGHTS,
  fx?: FxRates,
): MatchResult {
  const { program, institution } = entry;

  const tiebreakPriority = achievementPriority(profile.achievements);
  const openTracks: OpenTrack[] = [];
  const closedTracks: { track: (typeof program.tracks)[number]; blockers: ReturnType<typeof evaluateTrack>['blockers'] }[] = [];

  for (const track of program.tracks) {
    const { blockers, applicantScore } = evaluateTrack(profile, track);
    if (blockers.length > 0) {
      closedTracks.push({ track, blockers });
      continue;
    }
    openTracks.push({
      track,
      applicantScore,
      chance: estimateTrackChance(track, applicantScore, { tiebreakPriority }),
    });
  }

  // Порядок траекторий — это ответ на вопрос «куда мне реально идти».
  // Грант строго лучше платного, поэтому он показывается первым, пока он не
  // безнадёжен; сортировка только по вероятности выводила бы вперёд платное,
  // куда абитуриент проходит всегда, и прятала бы главную цель.
  openTracks.sort((a, b) => {
    const rank = (entryTrack: OpenTrack): number => {
      const probability = entryTrack.chance.probability ?? 0.3;
      const free = entryTrack.track.fundingType !== 'paid';
      if (free && probability >= HOPELESS_THRESHOLD) return 2;
      return free ? 0 : 1;
    };
    const byRank = rank(b) - rank(a);
    if (byRank !== 0) return byRank;
    return (b.chance.probability ?? 0.3) - (a.chance.probability ?? 0.3);
  });

  const affordability = scoreAffordability(profile, program, openTracks, fx);
  const realism = openTracks.reduce((best, entryTrack) => {
    const probability = entryTrack.chance.probability ?? 0.3;
    const weighted = entryTrack.track.fundingType === 'paid' ? probability * affordability : probability;
    return Math.max(best, weighted);
  }, 0);

  const factors: MatchFactors = {
    admissionRealism: clamp01(realism),
    fieldMatch: scoreFieldMatch(profile.preferences.fields, program.fields),
    affordability: clamp01(affordability),
    location: scoreLocation(profile, institution),
    language: scoreLanguage(profile, program),
    prestige: scorePrestige(institution),
  };

  const matchScore =
    Math.round(
      (factors.admissionRealism * weights.admissionRealism +
        factors.fieldMatch * weights.fieldMatch +
        factors.affordability * weights.affordability +
        factors.location * weights.location +
        factors.language * weights.language +
        factors.prestige * weights.prestige) *
        1000,
    ) / 10;

  const { reasons, warnings } = buildNarrative(profile, program, institution, openTracks);

  return {
    program,
    institution,
    matchScore,
    factors,
    openTracks,
    closedTracks,
    tuitionPerYear: program.tuitionPerYear,
    confidence: program.provenance.confidence,
    reasons,
    warnings,
  };
}

export { checkPreferences };
