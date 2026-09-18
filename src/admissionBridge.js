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

const COUNTRY_DEADLINES = {
  KZ: { date: '15 июля 2027', iso: '2027-07-15' },
  DE: { date: '15 июля 2027', iso: '2027-07-15' },
  TR: { date: '30 июня 2027', iso: '2027-06-30' },
  US: { date: '1 февраля 2027', iso: '2027-02-01' },
  IT: { date: '2 февраля 2027', iso: '2027-02-02' },
  KR: { date: '15 января 2027', iso: '2027-01-15' },
};

const INSTITUTION_DEADLINES = {
  nu: { date: '30 марта 2027', iso: '2027-03-30' },
  purdue: { date: '1 ноября 2026', iso: '2026-11-01' },
  yonsei: { date: '20 декабря 2026', iso: '2026-12-20' },
  kaist: { date: '15 января 2027', iso: '2027-01-15' },
  asu: { date: '1 февраля 2027', iso: '2027-02-01' },
  tum: { date: '15 июля 2027', iso: '2027-07-15' },
  rwth: { date: '15 июля 2027', iso: '2027-07-15' },
  metu: { date: '30 июня 2027', iso: '2027-06-30' },
  koc: { date: '15 июля 2027', iso: '2027-07-15' },
  polimi: { date: '2 февраля 2027', iso: '2027-02-02' },
  padua: { date: '2 февраля 2027', iso: '2027-02-02' },
  aitu: { date: '15 июля 2027', iso: '2027-07-15' },
  kimep: { date: '20 июля 2027', iso: '2027-07-20' },
  mit: { date: '1 января 2027', iso: '2027-01-01' },
  stanford: { date: '5 января 2027', iso: '2027-01-05' },
  harvard: { date: '1 января 2027', iso: '2027-01-01' },
  berkeley: { date: '30 ноября 2026', iso: '2026-11-30' },
  nyu: { date: '5 января 2027', iso: '2027-01-05' },
  gatech: { date: '4 января 2027', iso: '2027-01-04' },
  uw: { date: '15 ноября 2026', iso: '2026-11-15' },
  columbia: { date: '1 января 2027', iso: '2027-01-01' },
  cmu: { date: '3 января 2027', iso: '2027-01-03' },
  bocconi: { date: '25 января 2027', iso: '2027-01-25' },
  heidelberg: { date: '15 июля 2027', iso: '2027-07-15' },
  snu: { date: '7 марта 2027', iso: '2027-03-07' },
  bilkent: { date: '10 июля 2027', iso: '2027-07-10' },
  mnu: { date: '20 июля 2027', iso: '2027-07-20' },
  kazgasa: { date: '15 июля 2027', iso: '2027-07-15' },
  amu: { date: '15 июля 2027', iso: '2027-07-15' },
};

const COUNTRY_LIVING_COSTS = {
  KZ: '$300–450/мес',
  DE: '$850–1 100/мес',
  TR: '$350–550/мес',
  US: '$1 000–1 400/мес',
  IT: '$700–950/мес',
  KR: '$700–1 000/мес',
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

  const entVal = ent !== '' && !isNaN(Number(ent))
    ? Number(ent)
    : (targetCountries.includes('KZ') ? Math.round(((Number(gpa) || 3.6) / 4.0) * 115) : null);

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

  if (sat && !isNaN(Number(sat))) {
    examScores.sat_total = Number(sat);
  } else if (targetCountries.includes('US') || targetCountries.includes('TR')) {
    const baseGpa = Number(gpa) || 3.6;
    const baseIelts = Number(ielts) || 6.5;
    const projectedSat = Math.min(1600, Math.round(1100 + ((baseGpa - 2.5) / 1.5) * 350 + ((baseIelts - 5.0) / 4.0) * 150));
    examScores.sat_total = Math.max(900, projectedSat);
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
        ? `Закрыты треки: ${bestMatch.closedTracks.map((t) => (t.track ? t.track.title.ru : t.title?.ru || 'трек')).join(', ')}`
        : bestMatch.program.provenance.caveat || 'Уточняй финальные условия на официальном сайте.';

      const tuition = bestMatch.program.tuitionPerYear;
      const formattedCost = tuition
        ? tuition.currency === 'USD'
          ? `$${tuition.amount.toLocaleString('en-US')}`
          : `${tuition.amount.toLocaleString('ru-RU')} ₸`
        : 'Грант по конкурсу';

      const countryCode = bestMatch.institution.country || 'KZ';
      const deadlineInfo = INSTITUTION_DEADLINES[institution.id] || COUNTRY_DEADLINES[countryCode] || { date: '15 июля 2027', iso: '2027-07-15' };
      const livingCost = COUNTRY_LIVING_COSTS[countryCode] || '$500–800/мес';

      let minIelts = null;
      let minSat = null;
      const checkRequirement = (item) => {
        if (!item) return;
        if (item.exam === 'ielts') {
          if (minIelts === null || item.min > minIelts) minIelts = item.min;
        }
        if (item.exam === 'sat_total') {
          if (minSat === null || item.min > minSat) minSat = item.min;
        }
      };

      const primaryTrackObj = primaryTrack?.track || primaryTrack;
      (primaryTrackObj?.required || []).forEach(checkRequirement);
      (primaryTrackObj?.anyOf || []).forEach((group) => (group || []).forEach(checkRequirement));
      if (minIelts === null || minSat === null) {
        (bestMatch.program.tracks || []).forEach((track) => {
          (track.required || []).forEach(checkRequirement);
          (track.anyOf || []).forEach((group) => (group || []).forEach(checkRequirement));
        });
      }

      const formattedIelts =
        minIelts !== null
          ? minIelts.toFixed(1)
          : countryCode === 'KZ'
          ? 'Не требуется (ЕНТ)'
          : countryCode === 'DE'
          ? '6.5'
          : '6.0';

      const formattedSat =
        minSat !== null
          ? minSat.toLocaleString('ru-RU')
          : countryCode === 'KZ'
          ? 'Не требуется'
          : countryCode === 'US'
          ? '1 250 (рекомендуется)'
          : countryCode === 'TR'
          ? '1 200 (или YÖS)'
          : 'Не требуется';

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
        living: livingCost,
        ielts: formattedIelts,
        sat: formattedSat,
        date: deadlineInfo.date,
        iso: deadlineInfo.iso,
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
