import {
  ENT_CORE_EXAMS, ENT_PROFILE_THRESHOLD, ENT_SUBJECT_THRESHOLDS, EXAMS, examTitle,
  type ExamCode,
} from '../types/exams';
import { ACHIEVEMENT_TITLES } from '../types/achievements';
import type { ApplicantProfile } from '../types/applicant';
import {
  COUNTRY_TITLES, DEGREE_LEVEL_TITLES, FUNDING_TITLES, LANGUAGE_TITLES, STUDY_FORM_TITLES,
  type AdmissionTrack, type Institution, type Program,
} from '../types/institution';
import { formatMoney, toUsd, type FxRates } from '../types/money';
import type { Blocker } from '../types/match';

/**
 * Суммарный балл ЕНТ: обязательный блок (20 + 10 + 10) плюс два профильных по 50.
 * Возвращает null, если абитуриент не сдал что-то из обязательного блока или не
 * выбрал пару профильных — считать неполную сумму нельзя, она вводит в заблуждение.
 */
export function entTotal(profile: ApplicantProfile): number | null {
  let total = 0;
  for (const code of ENT_CORE_EXAMS) {
    const score = profile.examScores[code];
    if (score === undefined) return null;
    total += score;
  }
  const pair = profile.entProfilePair;
  if (pair === undefined) return null;
  for (const code of pair) {
    const score = profile.examScores[code];
    if (score === undefined) return null;
    total += score;
  }
  return total;
}

/** Предметные пороги ЕНТ: ниже них результат не засчитывается вообще. */
export function entThresholdBlockers(profile: ApplicantProfile): Blocker[] {
  const blockers: Blocker[] = [];
  for (const code of ENT_CORE_EXAMS) {
    const score = profile.examScores[code];
    const threshold = ENT_SUBJECT_THRESHOLDS[code] ?? 0;
    if (score !== undefined && score < threshold) {
      blockers.push({
        code: 'exam_below_min',
        exam: code,
        message: `${examTitle(code)}: ${score} при пороге ${threshold}`,
      });
    }
  }
  for (const code of profile.entProfilePair ?? []) {
    const score = profile.examScores[code];
    if (score !== undefined && score < ENT_PROFILE_THRESHOLD) {
      blockers.push({
        code: 'exam_below_min',
        exam: code,
        message: `${examTitle(code)}: ${score} при пороге ${ENT_PROFILE_THRESHOLD}`,
      });
    }
  }
  return blockers;
}

function checkRequirement(
  profile: ApplicantProfile,
  requirement: { exam: ExamCode; min: number },
): Blocker | null {
  const score = profile.examScores[requirement.exam];
  if (score === undefined) {
    return { code: 'missing_exam', exam: requirement.exam, message: `Нет результата: ${examTitle(requirement.exam)}` };
  }
  if (score < requirement.min) {
    return {
      code: 'exam_below_min',
      exam: requirement.exam,
      message: `${examTitle(requirement.exam)}: ${score} при минимуме ${requirement.min} (шкала до ${EXAMS[requirement.exam].max})`,
    };
  }
  return null;
}

export interface TrackEvaluation {
  readonly blockers: readonly Blocker[];
  /** Балл абитуриента в шкале этой траектории. null — шкала не определена. */
  readonly applicantScore: number | null;
}

/** Проверяет одну траекторию поступления и считает балл абитуриента в её шкале. */
export function evaluateTrack(profile: ApplicantProfile, track: AdmissionTrack): TrackEvaluation {
  const blockers: Blocker[] = [];

  // Квотный конкурс закрыт для тех, у кого нет соответствующего статуса.
  const required = track.requiresAchievement;
  if (required !== undefined && !profile.achievements.includes(required)) {
    blockers.push({
      code: 'quota_not_available',
      message: `Конкурс только для категории «${ACHIEVEMENT_TITLES[required]}»`,
    });
  }

  for (const requirement of track.required) {
    const blocker = checkRequirement(profile, requirement);
    if (blocker !== null) blockers.push(blocker);
  }

  for (const group of track.anyOf) {
    const satisfied = group.some((requirement) => checkRequirement(profile, requirement) === null);
    if (!satisfied) {
      const options = group
        .map((requirement) => `${examTitle(requirement.exam)} ≥ ${requirement.min}`)
        .join(' или ');
      blockers.push({ code: 'any_of_unsatisfied', message: `Нужно выполнить одно из: ${options}` });
    }
  }

  let applicantScore: number | null = null;

  if (track.kind === 'ent') {
    blockers.push(...entThresholdBlockers(profile));

    const pair = track.entProfilePair;
    const applicantPair = profile.entProfilePair;
    if (pair !== undefined) {
      if (applicantPair === undefined) {
        blockers.push({
          code: 'ent_profile_pair_mismatch',
          message: `Нужна пара профильных предметов ЕНТ: ${examTitle(pair[0])} + ${examTitle(pair[1])}`,
        });
      } else {
        const wanted = [...pair].sort();
        const have = [...applicantPair].sort();
        if (wanted[0] !== have[0] || wanted[1] !== have[1]) {
          blockers.push({
            code: 'ent_profile_pair_mismatch',
            message: `Программа требует ${examTitle(pair[0])} + ${examTitle(pair[1])}, а сдана пара ${examTitle(applicantPair[0])} + ${examTitle(applicantPair[1])}`,
          });
        }
      }
    }

    applicantScore = entTotal(profile);
    if (track.entMinTotal !== undefined) {
      if (applicantScore === null) {
        blockers.push({ code: 'ent_total_below_min', message: 'Не хватает результатов ЕНТ, чтобы посчитать сумму' });
      } else if (applicantScore < track.entMinTotal) {
        blockers.push({
          code: 'ent_total_below_min',
          message: `ЕНТ ${applicantScore} из 140 при минимуме ${track.entMinTotal}`,
        });
      }
    }
  } else if (track.scoreExam !== undefined) {
    applicantScore = profile.examScores[track.scoreExam] ?? null;
  }

  return { blockers, applicantScore };
}

/** Фильтры по предпочтениям — то, что делает программу неподходящей независимо от баллов. */
export function checkPreferences(
  profile: ApplicantProfile,
  program: Program,
  institution: Institution,
  fx?: FxRates,
): Blocker[] {
  const blockers: Blocker[] = [];
  const prefs = profile.preferences;

  const countryAllowed = prefs.countries.length === 0 || prefs.countries.includes(institution.country);
  const cityAllowed = prefs.cities.length === 0 || prefs.cities.includes(institution.city);

  if (!countryAllowed && !prefs.willingToRelocate) {
    blockers.push({
      code: 'country_not_allowed',
      message: `${COUNTRY_TITLES[institution.country]} не входит в выбранные страны, а переезд не рассматривается`,
    });
  }
  if (countryAllowed && !cityAllowed && !prefs.willingToRelocate) {
    blockers.push({ code: 'city_not_allowed', message: `${institution.city} — не тот город, и переезд не рассматривается` });
  }

  if (prefs.languages.length > 0 && !program.languages.some((lang) => prefs.languages.includes(lang))) {
    blockers.push({
      code: 'language_not_allowed',
      message: `Обучение на языке: ${program.languages.map((l) => LANGUAGE_TITLES[l]).join(', ')}`,
    });
  }

  if (prefs.studyForms.length > 0 && !prefs.studyForms.includes(program.studyForm)) {
    blockers.push({ code: 'study_form_not_allowed', message: `Форма обучения «${STUDY_FORM_TITLES[program.studyForm]}» не выбрана` });
  }

  if (prefs.degreeLevels.length > 0 && !prefs.degreeLevels.includes(program.degreeLevel)) {
    blockers.push({ code: 'degree_level_not_allowed', message: `Уровень «${DEGREE_LEVEL_TITLES[program.degreeLevel]}» не выбран` });
  }

  if (prefs.fundingTypes.length > 0) {
    const available = program.tracks.map((track) => track.fundingType);
    if (!available.some((funding) => prefs.fundingTypes.includes(funding))) {
      blockers.push({
        code: 'funding_not_allowed',
        message: `Доступно только: ${[...new Set(available)].map((f) => FUNDING_TITLES[f]).join(', ')}`,
      });
    }
  }

  // Слишком дорогое платное отсекается лишь тогда, когда бесплатной траектории нет.
  const hasFreeTrack = program.tracks.some((track) => track.fundingType !== 'paid');
  const limit = prefs.maxTuitionPerYear;
  const tuition = program.tuitionPerYear;
  if (!hasFreeTrack && limit !== null && tuition !== null && toUsd(tuition, fx) > toUsd(limit, fx)) {
    blockers.push({
      code: 'tuition_too_expensive',
      message: `Только платное за ${formatMoney(tuition)} в год при лимите ${formatMoney(limit)}`,
    });
  }

  if (prefs.needsDormitory && !institution.hasDormitory) {
    blockers.push({ code: 'no_dormitory', message: 'У вуза нет общежития' });
  }

  return blockers;
}
