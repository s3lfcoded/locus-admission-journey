import { describe, expect, it } from 'vitest';
import {
  INSTITUTIONS, PROGRAMS, buildApplicationShortlist, convert, datasetSummary,
  estimateTrackChance, formatMoney, getProgram, matchInstitutions, matchPrograms,
  normalizeWeights, parseInstitutions, toUsd, DEFAULT_WEIGHTS, INSTITUTIONS_RAW,
} from '../src/lib/admission/index';
import type { ApplicantProfileInput } from '../src/lib/admission/index';

const itApplicant: ApplicantProfileInput = {
  examScores: {
    ent_history_kz: 16, ent_math_literacy: 8, ent_reading_literacy: 8,
    ent_mathematics: 42, ent_informatics: 45,
  },
  entProfilePair: ['ent_mathematics', 'ent_informatics'],
  preferences: { fields: ['it'], countries: ['KZ'], languages: ['ru', 'en'] },
};

describe('датасет', () => {
  it('проходит валидацию и не содержит дублей', () => {
    expect(() => parseInstitutions(INSTITUTIONS_RAW)).not.toThrow();
    const ids = PROGRAMS.map((entry) => entry.program.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('покрывает Казахстан и зарубежные направления', () => {
    const countries = new Set(INSTITUTIONS.map((institution) => institution.country));
    expect(countries.has('KZ')).toBe(true);
    expect(countries.size).toBeGreaterThan(1);
  });

  it('сводка считает программы по уровню достоверности', () => {
    const summary = datasetSummary();
    const total = summary.byConfidence.verified + summary.byConfidence.reported + summary.byConfidence.estimated;
    expect(total).toBe(summary.programs);
  });

  it('каждая verified-программа имеет источник', () => {
    for (const { program } of PROGRAMS) {
      if (program.provenance.confidence === 'verified') {
        expect(program.provenance.sources.length).toBeGreaterThan(0);
      }
    }
  });

  it('отвергает программу с траекторией ЕНТ без пары профильных', () => {
    const broken = structuredClone(INSTITUTIONS_RAW[1]) as Record<string, any>;
    delete broken.programs[0].tracks[0].entProfilePair;
    expect(() => parseInstitutions([broken])).toThrow();
  });
});

describe('валюты', () => {
  it('переводит тенге в доллары и обратно', () => {
    const tuition = { amount: 3_000_000, currency: 'KZT' } as const;
    const usd = convert(tuition, 'USD');
    expect(usd.currency).toBe('USD');
    expect(usd.amount).toBeGreaterThan(0);
    expect(convert(usd, 'KZT').amount).toBeCloseTo(3_000_000, 0);
  });

  it('сравнивает суммы в разных валютах через доллар', () => {
    expect(toUsd({ amount: 15000, currency: 'USD' })).toBe(15000);
    expect(toUsd({ amount: 3_000_000, currency: 'KZT' })).toBeLessThan(15000);
  });

  it('форматирует суммы с символом валюты', () => {
    expect(formatMoney({ amount: 3_000_000, currency: 'KZT' })).toContain('₸');
    expect(formatMoney({ amount: 15000, currency: 'USD' }, 'en-US')).toContain('$');
  });
});

describe('подбор', () => {
  it('возвращает только программы с открытой траекторией', () => {
    const { matches } = matchPrograms(itApplicant);
    expect(matches.length).toBeGreaterThan(0);
    for (const match of matches) {
      expect(match.openTracks.length).toBeGreaterThan(0);
      expect(match.institution.country).toBe('KZ');
    }
  });

  it('сортирует по убыванию балла соответствия', () => {
    const scores = matchPrograms(itApplicant).matches.map((m) => m.matchScore);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('объясняет, почему программа не подошла', () => {
    const { rejected } = matchPrograms(itApplicant);
    const medicine = rejected.find((entry) => entry.program.id === 'kaznu-medicine');
    expect(medicine).toBeDefined();
    expect(medicine!.blockers.length).toBeGreaterThan(0);
  });

  it('показывает закрытые траектории у подошедшей программы', () => {
    const lowScore = matchPrograms({
      examScores: {
        ent_history_kz: 12, ent_math_literacy: 6, ent_reading_literacy: 6,
        ent_mathematics: 20, ent_informatics: 22,
      },
      entProfilePair: ['ent_mathematics', 'ent_informatics'],
    });
    const kbtu = lowScore.matches.find((m) => m.program.id === 'kbtu-it');
    expect(kbtu).toBeDefined();
    // Грант закрыт по баллу, платное открыто — программа остаётся в выдаче.
    expect(kbtu!.closedTracks.some((t) => t.track.fundingType === 'grant')).toBe(true);
    expect(kbtu!.openTracks.some((t) => t.track.fundingType === 'paid')).toBe(true);
  });

  it('фильтрует по языку обучения', () => {
    const { matches } = matchPrograms({
      ...itApplicant,
      preferences: { ...itApplicant.preferences, languages: ['kk'] },
    });
    for (const match of matches) {
      expect(match.program.languages).toContain('kk');
    }
  });

  it('verifiedOnly оставляет только подтверждённые данные', () => {
    const { matches } = matchPrograms(
      { examScores: { gpa_5: 4.5, ielts: 7 }, preferences: {} },
      { verifiedOnly: true },
    );
    for (const match of matches) {
      expect(match.confidence).toBe('verified');
    }
  });

  it('предупреждает о неподтверждённых цифрах', () => {
    const { matches } = matchPrograms(itApplicant);
    const estimated = matches.find((m) => m.confidence === 'estimated');
    expect(estimated).toBeDefined();
    expect(estimated!.warnings.join(' ')).toMatch(/ОЦЕНКА|не подтвержден|сверьте/i);
  });
});

describe('шансы', () => {
  it('учитывают ширину шкалы траектории', () => {
    const entTrack = getProgram('kbtu-it')!.program.tracks.find((t) => t.id === 'kbtu-it-grant')!;
    const below = estimateTrackChance(entTrack, 100);
    const at = estimateTrackChance(entTrack, 118);
    const above = estimateTrackChance(entTrack, 135);

    expect(below.probability!).toBeLessThan(at.probability!);
    expect(at.probability!).toBeCloseTo(0.5, 1);
    expect(above.probability!).toBeGreaterThan(at.probability!);
  });

  it('честно сообщают, что оценить нечем, если проходной не публиковался', () => {
    const track = getProgram('nu-foundation')!.program.tracks[0]!;
    const chance = estimateTrackChance(track, 6);
    expect(chance.level).toBe('unknown');
    expect(chance.probability).toBeNull();
  });
});

describe('веса и группировка', () => {
  it('нормализуются и отвергают нечисловые значения', () => {
    const weights = normalizeWeights({ prestige: 10 });
    expect(Object.values(weights).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(() => normalizeWeights({ language: Number.NaN })).toThrow();
    expect(Object.keys(normalizeWeights()).sort()).toEqual(Object.keys(DEFAULT_WEIGHTS).sort());
  });

  it('группирует по вузам без дублей', () => {
    const grouped = matchInstitutions(itApplicant);
    const ids = grouped.map((entry) => entry.institution.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('раскладывает шорт-лист по риску', () => {
    const shortlist = buildApplicationShortlist(itApplicant, { perBucket: 2, maxPerInstitution: 1 });
    const all = [...shortlist.safe, ...shortlist.target, ...shortlist.reach];
    const institutions = all.map((m) => m.institution.id);
    expect(new Set(institutions).size).toBe(institutions.length);
  });

  it('содержит расширенный каталог с богатым выбором вузов США и разными направлениями', () => {
    expect(INSTITUTIONS.length).toBeGreaterThanOrEqual(30);
    const usaUnis = INSTITUTIONS.filter((inst) => inst.country === 'US');
    expect(usaUnis.length).toBeGreaterThanOrEqual(9);
    const usaIds = usaUnis.map((u) => u.id);
    expect(usaIds).toContain('mit');
    expect(usaIds).toContain('stanford');
    expect(usaIds).toContain('harvard');
    expect(usaIds).toContain('berkeley');
    expect(usaIds).toContain('nyu');
    expect(usaIds).toContain('gatech');
    expect(usaIds).toContain('cmu');
    expect(usaIds).toContain('columbia');
    expect(usaIds).toContain('uw');

    // Проверяем подбор для сильного абитуриента в США
    const usaApplicant: ApplicantProfileInput = {
      examScores: { sat_total: 1560, ielts: 8.0, gpa_4: 3.95 },
      preferences: { fields: ['it', 'engineering'], countries: ['US'], languages: ['en'] },
    };
    const usaMatches = matchInstitutions(usaApplicant);
    expect(usaMatches.length).toBeGreaterThanOrEqual(5);
    expect(usaMatches.some((m) => m.institution.id === 'mit')).toBe(true);

    // Проверяем юридическое и дизайнерское направления
    const lawPrograms = PROGRAMS.filter((p) => p.program.fields.includes('law'));
    expect(lawPrograms.length).toBeGreaterThanOrEqual(3);

    const designPrograms = PROGRAMS.filter((p) => p.program.fields.includes('design'));
    expect(designPrograms.length).toBeGreaterThanOrEqual(3);
  });
});

