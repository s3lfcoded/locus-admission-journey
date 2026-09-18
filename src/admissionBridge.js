import {
  matchPrograms,
  matchInstitutions,
  buildRoadmap,
  parseProfile,
  INSTITUTIONS,
  COUNTRY_TITLES,
  LANGUAGE_TITLES,
  STUDY_FIELD_TITLES,
  ENT_MAX_TOTAL,
  entTotal,
} from './lib/admission/index';

const FIELD_MAP = {
  IT: 'it',
  Инженерия: 'engineering',
  Бизнес: 'management',
  Экономика: 'economics',
  Медицина: 'medicine',
  Право: 'law',
  Дизайн: 'design',
};

const COUNTRY_MAP = {
  Казахстан: 'KZ',
  Германия: 'DE',
  Италия: 'IT',
  Корея: 'KR',
  Турция: 'TR',
  США: 'US',
};

export function buildEngineProfile({
  interests = ['IT'],
  gpa = 3.6,
  ielts = 6.5,
  ent = '',
  sat = '',
  budget = 3000,
  countries = ['Казахстан', 'Италия'],
  achievements = [],
}) {
  const fields = (interests || []).map((i) => FIELD_MAP[i] || 'it');
  const targetCountries = (countries || []).map((c) => COUNTRY_MAP[c] || 'KZ');

  const examScores = {
    ielts: Number(ielts) || 6.5,
    gpa_4: Number(gpa) || 3.6,
    gpa_5: Math.min(5.0, Number(((Number(gpa) || 3.6) * 1.25).toFixed(2))),
  };

  if (sat && !isNaN(Number(sat))) {
    examScores.sat_total = Number(sat);
  }

  let entProfilePair = ['ent_mathematics', 'ent_informatics'];
  if (fields.includes('medicine')) {
    entProfilePair = ['ent_biology', 'ent_chemistry'];
  } else if (fields.includes('engineering')) {
    entProfilePair = ['ent_mathematics', 'ent_physics'];
  } else if (fields.includes('economics') || fields.includes('management')) {
    entProfilePair = ['ent_mathematics', 'ent_geography'];
  } else if (fields.includes('law')) {
    entProfilePair = ['ent_world_history', 'ent_human_society_law'];
  }

  const entVal = ent !== '' && !isNaN(Number(ent)) ? Number(ent) : null;
  if (entVal !== null) {
    const ratio = Math.max(0, Math.min(1, entVal / 140));
    const h = Math.min(20, Math.round(20 * ratio));
    const ml = Math.min(10, Math.round(10 * ratio));
    const rl = Math.min(10, Math.round(10 * ratio));
    const p1 = Math.min(50, Math.round(50 * ratio));
    const p2 = Math.min(50, Math.max(0, entVal - (h + ml + rl + p1)));

    examScores.ent_history_kz = h;
    examScores.ent_math_literacy = ml;
    examScores.ent_reading_literacy = rl;
    examScores[entProfilePair[0]] = p1;
    examScores[entProfilePair[1]] = p2;
  }

  return {
    examScores,
    entProfilePair,
    achievements: achievements || [],
    preferences: {
      fields: fields.length ? fields : ['it'],
      countries: targetCountries.length ? targetCountries : ['KZ', 'IT'],
      languages: ['en', 'ru', 'kk'],
      maxTuitionPerYear: budget > 0 ? { amount: Number(budget), currency: 'USD' } : null,
      willingToRelocate: true,
    },
  };
}

export function evaluateAdmissionState(inputs) {
  try {
    const rawProfile = buildEngineProfile(inputs);
    const parsed = parseProfile(rawProfile);

    const institutionMatches = matchInstitutions(rawProfile, { includeRejected: true });
    const programMatches = matchPrograms(rawProfile, { includeRejected: true });
    const roadmap = buildRoadmap(parsed, { asOf: '2026-09-17' });

    const schools = institutionMatches.map(({ institution, bestMatch, matches }) => {
      const open = bestMatch.openTracks || [];
      const primaryTrack = open[0];
      const level = primaryTrack?.chance?.level || 'unknown';

      let type = 'Target';
      let color = 'blue';
      if (level === 'safe' || level === 'likely' || bestMatch.matchScore >= 0.85) {
        type = 'Safety';
        color = 'green';
      } else if (level === 'reach' || level === 'unlikely' || bestMatch.matchScore < 0.65) {
        type = 'Reach';
        color = 'amber';
      }

      const matchPercent = Math.max(45, Math.min(99, Math.round(bestMatch.matchScore * 100)));

      const reasons = [];
      if (bestMatch.factors) {
        if (bestMatch.factors.fieldMatch > 0.7) reasons.push('Высокое соответствие выбранному направлению');
        if (bestMatch.factors.examScoreMatch > 0.6) reasons.push('Академические баллы в конкурентном диапазоне');
        if (bestMatch.factors.tuitionMatch > 0.8) reasons.push('Соответствует заданному бюджету на обучение');
        if (bestMatch.factors.locationMatch > 0.8) reasons.push('В приоритетном регионе поступления');
      }
      if (!reasons.length) {
        reasons.push(`Программа: ${bestMatch.program.title.ru}`, 'Доступны актуальные траектории приёма');
      }

      const risk = bestMatch.closedTracks?.length
        ? `Закрыты треки: ${bestMatch.closedTracks.map((t) => t.title.ru).join(', ')}`
        : bestMatch.program.provenance.caveat || 'Уточняй финальные условия на официальном сайте.';

      const tuition = bestMatch.program.tuitionPerYear;
      const formattedCost = tuition
        ? tuition.currency === 'USD'
          ? `$${tuition.amount.toLocaleString('en-US')}`
          : `${tuition.amount.toLocaleString('ru-RU')} ₸`
        : 'Грант по конкурсу';

      const deadline = bestMatch.institution.country === 'KZ' ? '15 июля 2027' : '2 февраля 2027';
      const iso = bestMatch.institution.country === 'KZ' ? '2027-07-15' : '2027-02-02';

      return {
        id: institution.id,
        name: institution.name.en || institution.name.ru,
        nameRu: institution.name.ru,
        nameKz: institution.name.kk,
        place: `${COUNTRY_TITLES[institution.country] || institution.country} · ${institution.city}`,
        type,
        match: matchPercent,
        mark: institution.shortName || institution.id.toUpperCase(),
        color,
        cost: formattedCost,
        living: institution.country === 'KZ' ? '$300–500' : '$700–950',
        ielts: institution.id === 'nu' ? '7.0' : institution.id === 'padua' ? '6.5' : '6.0',
        sat: institution.id === 'nu' ? '1 400' : 'Не требуется',
        date: deadline,
        iso,
        url: institution.website,
        why: reasons.slice(0, 2),
        risk,
        confidence: bestMatch.program.provenance.confidence,
        confidenceTitle:
          bestMatch.program.provenance.confidence === 'verified'
            ? 'Официально подтверждено'
            : bestMatch.program.provenance.confidence === 'reported'
            ? 'По публикациям СМИ'
            : 'Оценка (требует сверки)',
        openTracksCount: open.length,
        bestProgramTitle: bestMatch.program.title.ru,
      };
    });

    return {
      schools: schools.length ? schools : null,
      roadmap,
      programMatches,
    };
  } catch (err) {
    console.error('Admission engine calculation error:', err);
    return null;
  }
}
