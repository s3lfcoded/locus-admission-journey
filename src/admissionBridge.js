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

export const INSTITUTION_RISKS = {
  // США
  mit: 'Экстремальный конкурс (зачисление < 4%). Нужны SAT 1540+, олимпиады мирового уровня и исследовательские проекты.',
  stanford: 'Конкурс мирового уровня (< 4%). Нужен безупречный GPA, SAT 1520+, мощное лидерство и уникальные эссе.',
  harvard: 'Селективность < 3.5%. Требуется выдающийся академический профиль (SAT 1530+), рекомендации и внеучебное портфолио.',
  berkeley: 'Высочайший конкурс на IT и инженерию (< 8%). Высокая стоимость для международных студентов ($44 000+/год).',
  columbia: 'Низкий процент зачисления (< 4%). Высокая стоимость жизни в Нью-Йорке. Требуется SAT 1510+ и эссе по Core.',
  cmu: 'Школа CS в CMU — одна из сильнейших в мире, конкурс высочайший. Нужна сильная олимпиадная математика.',
  nyu: 'Высокая стоимость обучения ($60k+) и проживания на Манхэттене. Финансовая помощь иностранцам строго ограничена.',
  gatech: 'Прямое зачисление на CS квотировано. Высокий порог по профильной математике SAT (Math 750+).',
  uw: 'Направление Computer Science отбирается по отдельному конкурсу Direct to Major с максимальным порогом.',
  purdue: 'Колледж инженерии и CS требует SAT 1420+ и высокий GPA (от 3.8). Квоты на иностранных студентов.',
  asu: 'Стоимость обучения ($34 000/год). Академическая стипендия New American University покрывает только $5k–15k.',

  // Казахстан
  nu: 'Высокий языковой порог: IELTS 7.0 (не ниже 6.0 по секциям). Жесткий конкурс на гранты среди лучших выпускников.',
  kbtu: 'Высокий порог ЕНТ на IT-грант (от 118–122 баллов). Платное обучение требует отдельного финансового планирования.',
  sdu: 'Конкуренция умеренная. Внутренние гранты и скидки распределяются по олимпиаде SDU и общему конкурсу ЕНТ.',
  aitu: 'Высокий конкурс на государственные гранты в IT и кибербезопасности. Требуется балл ЕНТ от 110+.',
  iitu: 'Плотный конкурс по Software Engineering. На государственный грант требуется ЕНТ от 108–112.',
  kaznu: 'Большой конкурс среди сельских и городских квот. Приоритет отдаётся обладателям «Алтын белгі» при равенстве.',
  satbayev: 'Требуется уверенный балл по профильной математике и физике. Места в общежитии распределяются по конкурсу.',
  kimep: 'Обучение полностью платное при отсутствии стипендии. Требуется IELTS от 6.0 или внутренний экзамен.',
  narxoz: 'Грантовые места ограничены квотами МОН РК. При равенстве баллов ЕНТ решает средний балл аттестата.',
  kaznmu: 'Высокий порог ЕНТ по биологии и химии (120+ на грант), плюс обязательный психометрический экзамен.',
  mnu: 'Высокие академические стандарты по праву и бизнесу. Гранты распределяются по строгому внутреннему рейтингу.',
  kazgasa: 'Обязательны два творческих экзамена (рисунок и черчение), которые определяют итоговый рейтинг.',
  amu: 'Ограниченное число грантовых мест в столице. Обязателен допуск по психометрическому экзамену.',

  // Италия
  padua: 'Конкуренция высокая. Важно вовремя подать документы на региональную стипендию ESU/ISEE и визу D.',
  polimi: 'Вступительный онлайн-тест TOL/TIL с жестким проходным баллом. Ограниченное число мест для non-EU студентов.',
  bocconi: 'Высокие требования к тесту Bocconi / SAT (1420+) и мотивационному профилю. Высокая стоимость без стипендии.',

  // Германия
  tum: 'Двухэтапный отбор: профильное эссе, математический тест и интервью. Введена плата для non-EU (€2 000–3 000/сем).',
  rwth: 'Строгие требования к академической базе по математике и механике. Необходим Studienkolleg или 1 курс вуза дома.',
  heidelberg: 'Высокий конкурс на медицинские и научные специальности. Требуется немецкий C1 или сильный английский.',

  // Южная Корея
  kaist: 'Конкурс на полную стипендию среди топ-1% абитуриентов мира. Сложные технические интервью по математике и физике.',
  snu: 'Флагманский университет Кореи. Крайне низкий процент зачисления международных студентов без корейского языка.',
  yonsei: 'Англоязычный колледж UIC требует сильное эссе, рекомендательные письма и интервью. Проживание в Сондо обязательно.',

  // Турция
  metu: 'Конкурс по SAT (минимум 1350+, Math 700+). Количество мест для иностранных студентов строго квотировано.',
  koc: 'Элитный частный университет. Полная стипендия требует SAT 1460+ и выдающиеся внеучебные достижения.',
  bilkent: 'Высокие требования к английскому (IELTS 6.5) и результатам SAT/YÖS для получения скидки на обучение.',
};

const ULTRA_SELECTIVE_IDS = new Set([
  'mit', 'stanford', 'harvard', 'berkeley', 'columbia', 'cmu'
]);

const HIGH_SELECTIVE_IDS = new Set([
  'nu', 'kaist', 'tum', 'bocconi', 'gatech', 'uw', 'snu', 'purdue'
]);

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

      // Check if any open track offers safe or target admission
      const hasSafeTrack = open.some((t) => t.chance?.level === 'safe' || t.chance?.level === 'likely');
      const hasTargetTrack = open.some((t) => t.chance?.level === 'target');

      // bestMatch.matchScore is calculated out of 100 in scoring.ts
      const rawScore = bestMatch.matchScore > 1 ? bestMatch.matchScore : bestMatch.matchScore * 100;
      const matchPercent = Math.max(35, Math.min(98, Math.round(rawScore)));

      const gpaNum = Number(inputs.gpa) || 3.6;
      const ieltsNum = Number(inputs.ielts) || 6.5;
      const satNum = inputs.sat ? Number(inputs.sat) : 0;

      // Realistic risk tiering based on selectivity, academic thresholds, and track chance
      let type = 'Target';
      let color = 'blue';

      if (ULTRA_SELECTIVE_IDS.has(institution.id)) {
        // Ultra-selective Ivy / Top-10 US (< 8% acceptance rate) are ALWAYS Reach
        type = 'Reach';
        color = 'amber';
      } else if (HIGH_SELECTIVE_IDS.has(institution.id)) {
        // High-selective institutions (NU, KAIST, TUM, Bocconi, etc.)
        const isExceptional = (satNum >= 1480 || (ieltsNum >= 7.5 && gpaNum >= 3.85));
        if (isExceptional && (hasSafeTrack || hasTargetTrack || rawScore >= 85)) {
          type = 'Target';
          color = 'blue';
        } else {
          type = 'Reach';
          color = 'amber';
        }
      } else if (hasSafeTrack && rawScore >= 68) {
        type = 'Safety';
        color = 'green';
      } else if (hasTargetTrack || rawScore >= 65) {
        type = 'Target';
        color = 'blue';
      } else {
        type = 'Reach';
        color = 'amber';
      }

      const reasons = [];
      if (bestMatch.factors) {
        if (bestMatch.factors.fieldMatch > 0.7) reasons.push('Высокое соответствие выбранному направлению');
        if (bestMatch.factors.admissionRealism > 0.6) reasons.push('Академические баллы в конкурентном диапазоне');
        if (bestMatch.factors.affordability > 0.8) reasons.push('Соответствует заданному бюджету на обучение');
        if (bestMatch.factors.location > 0.8) reasons.push('В приоритетном регионе поступления');
      }
      if (!reasons.length) {
        reasons.push(`Программа: ${bestMatch.program.title.ru}`, 'Доступны актуальные траектории приёма');
      }

      const tuition = bestMatch.program.tuitionPerYear;
      const formattedCost = tuition
        ? tuition.currency === 'USD'
          ? `$${tuition.amount.toLocaleString('en-US')}`
          : `${tuition.amount.toLocaleString('ru-RU')} ₸`
        : 'Грант по конкурсу';

      // Tailored institutional and contextual risk analysis
      let risk = INSTITUTION_RISKS[institution.id] || null;

      if (!risk) {
        if (bestMatch.closedTracks?.length) {
          risk = `Закрыты треки: ${bestMatch.closedTracks.map((t) => (t.track ? t.track.title.ru : t.title?.ru || 'трек')).join(', ')}`;
        } else {
          risk = bestMatch.program.provenance.caveat || 'Уточняй финальные условия на официальном сайте.';
        }
      }

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

      let finalRisk = risk;
      if (minIelts !== null && ieltsNum < minIelts) {
        finalRisk = `Порог IELTS: ${minIelts.toFixed(1)} (у тебя ${ieltsNum.toFixed(1)}). Потребуется пересдача экзамена до дедлайна.`;
      } else if (minSat !== null && satNum > 0 && satNum < minSat) {
        finalRisk = `Рекомендуемый балл SAT: ${minSat} (у тебя ${satNum}). Желательно пересдать для повышения шансов.`;
      }

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
        risk: finalRisk,
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
