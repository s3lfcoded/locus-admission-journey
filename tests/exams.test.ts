import { describe, expect, it } from 'vitest';
import {
  ENT_MAX_TOTAL, EXAMS, entTotal, entThresholdBlockers, evaluateTrack,
  getProgram, normalizedScore, parseProfile,
} from '../src/lib/admission/index';
import type { ApplicantProfileInput } from '../src/lib/admission/index';

/** Сильный «айтишник»: 16 + 8 + 8 + 42 + 45 = 119 из 140. */
const strongItEnt: ApplicantProfileInput = {
  examScores: {
    ent_history_kz: 16, ent_math_literacy: 8, ent_reading_literacy: 8,
    ent_mathematics: 42, ent_informatics: 45,
  },
  entProfilePair: ['ent_mathematics', 'ent_informatics'],
};

describe('шкалы экзаменов', () => {
  it('у блоков ЕНТ разные максимумы, а не единая стобалльная шкала', () => {
    expect(EXAMS.ent_history_kz.max).toBe(20);
    expect(EXAMS.ent_math_literacy.max).toBe(10);
    expect(EXAMS.ent_mathematics.max).toBe(50);
    expect(20 + 10 + 10 + 50 + 50).toBe(ENT_MAX_TOTAL);
  });

  it('международные тесты имеют свои шкалы и шаг', () => {
    expect(EXAMS.ielts.max).toBe(9);
    expect(EXAMS.ielts.step).toBe(0.5);
    expect(EXAMS.sat_total.min).toBe(400);
    expect(EXAMS.sat_total.max).toBe(1600);
    expect(EXAMS.gpa_5.max).toBe(5);
  });

  it('нормализация приводит разные шкалы к доле от максимума', () => {
    expect(normalizedScore('ielts', 9)).toBe(1);
    expect(normalizedScore('ent_mathematics', 25)).toBe(0.5);
    expect(normalizedScore('sat_total', 1000)).toBeCloseTo(0.5, 2);
  });
});

describe('суммарный балл ЕНТ', () => {
  it('складывает обязательный блок и пару профильных', () => {
    expect(entTotal(parseProfile(strongItEnt))).toBe(119);
  });

  it('возвращает null, если пара профильных не выбрана', () => {
    const profile = parseProfile({ examScores: strongItEnt.examScores });
    expect(entTotal(profile)).toBeNull();
  });

  it('возвращает null при неполном обязательном блоке — неполную сумму считать нельзя', () => {
    const profile = parseProfile({
      examScores: { ent_history_kz: 16, ent_mathematics: 42, ent_informatics: 45 },
      entProfilePair: ['ent_mathematics', 'ent_informatics'],
    });
    expect(entTotal(profile)).toBeNull();
  });

  it('ловит недобор по предметному порогу', () => {
    const profile = parseProfile({
      examScores: { ...strongItEnt.examScores, ent_history_kz: 3 },
      entProfilePair: ['ent_mathematics', 'ent_informatics'],
    });
    expect(entThresholdBlockers(profile)).toContainEqual(
      expect.objectContaining({ code: 'exam_below_min', exam: 'ent_history_kz' }),
    );
  });
});

describe('валидация профиля', () => {
  it('отвергает балл вне шкалы конкретного экзамена', () => {
    expect(() => parseProfile({ examScores: { ent_math_literacy: 40 } })).toThrow();
    expect(() => parseProfile({ examScores: { ielts: 10 } })).toThrow();
  });

  it('принимает корректный IELTS с половинным шагом', () => {
    expect(parseProfile({ examScores: { ielts: 6.5 } }).examScores.ielts).toBe(6.5);
  });

  it('отвергает непрофильный предмет в паре ЕНТ', () => {
    expect(() =>
      parseProfile({ entProfilePair: ['ent_history_kz', 'ent_mathematics'] }),
    ).toThrow();
  });

  it('отвергает одинаковые предметы в паре', () => {
    expect(() =>
      parseProfile({ entProfilePair: ['ent_mathematics', 'ent_mathematics'] }),
    ).toThrow();
  });
});

describe('проверка траектории', () => {
  it('открывает грантовый трек при достаточном балле ЕНТ', () => {
    const entry = getProgram('kbtu-it')!;
    const grant = entry.program.tracks.find((t) => t.id === 'kbtu-it-grant')!;
    const { blockers, applicantScore } = evaluateTrack(parseProfile(strongItEnt), grant);

    expect(blockers).toEqual([]);
    expect(applicantScore).toBe(119);
  });

  it('закрывает трек при неподходящей паре профильных предметов', () => {
    const entry = getProgram('kaznu-medicine')!;
    const grant = entry.program.tracks.find((t) => t.id === 'kaznu-med-grant')!;
    const { blockers } = evaluateTrack(parseProfile(strongItEnt), grant);

    expect(blockers).toContainEqual(expect.objectContaining({ code: 'ent_profile_pair_mismatch' }));
  });

  it('требует выполнить одно из альтернативных требований', () => {
    const entry = getProgram('nu-engineering')!;
    const track = entry.program.tracks[0]!;
    const noEnglish = parseProfile({ examScores: { gpa_5: 4.5 } });
    expect(evaluateTrack(noEnglish, track).blockers).toContainEqual(
      expect.objectContaining({ code: 'any_of_unsatisfied' }),
    );

    const withToefl = parseProfile({ examScores: { gpa_5: 4.5, toefl_ibt: 90 } });
    expect(evaluateTrack(withToefl, track).blockers).toEqual([]);
  });
});
