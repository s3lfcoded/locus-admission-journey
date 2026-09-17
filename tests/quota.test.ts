import { describe, expect, it } from 'vitest';
import {
  STUDY_FIELD_TITLES, achievementPriority, estimateTrackChance, evaluateTrack,
  getProgram, matchPrograms, parseProfile, PROGRAMS,
} from '../src/lib/admission/index';
import type { ApplicantProfileInput } from '../src/lib/admission/index';

/** Выпускник сельской школы, ровно на проходном общего конкурса КазНУ (98). */
const ruralBorderline: ApplicantProfileInput = {
  examScores: {
    ent_history_kz: 15, ent_math_literacy: 7, ent_reading_literacy: 7,
    ent_mathematics: 35, ent_informatics: 34,
  },
  entProfilePair: ['ent_mathematics', 'ent_informatics'],
  achievements: ['rural_quota'],
};

describe('новые направления в датасете', () => {
  it('покрывают инженерию с парой математика + физика', () => {
    const engineering = PROGRAMS.filter((entry) =>
      entry.program.tracks.some(
        (track) =>
          track.entProfilePair?.[0] === 'ent_mathematics' && track.entProfilePair[1] === 'ent_physics',
      ),
    );
    expect(engineering.length).toBeGreaterThan(0);
    expect(engineering.some((entry) => entry.program.fields.includes('engineering'))).toBe(true);
  });

  it('покрывают медицину с парой биология + химия', () => {
    const medicine = PROGRAMS.filter((entry) => entry.program.fields.includes('medicine'));
    expect(medicine.length).toBeGreaterThan(0);
    for (const entry of medicine) {
      for (const track of entry.program.tracks) {
        expect(track.entProfilePair).toEqual(['ent_biology', 'ent_chemistry']);
        // Государственный порог для медицины — 70, а не общие 65.
        expect(track.entMinTotal).toBeGreaterThanOrEqual(70);
      }
    }
  });

  it('покрывают бизнес и финансы с парой математика + география', () => {
    const business = PROGRAMS.filter((entry) => entry.program.fields.includes('economics'));
    expect(business.length).toBeGreaterThan(0);
    expect(
      business.some((entry) =>
        entry.program.tracks.some(
          (track) =>
            track.entProfilePair?.[0] === 'ent_mathematics' && track.entProfilePair[1] === 'ent_geography',
        ),
      ),
    ).toBe(true);
    expect(STUDY_FIELD_TITLES.economics).toBeTruthy();
  });
});

describe('сельская квота', () => {
  it('описана отдельным конкурсом с долей мест, а не надбавкой к баллу', () => {
    const track = getProgram('kaznu-medicine')!.program.tracks.find((t) => t.id === 'kaznu-med-rural')!;
    expect(track.requiresAchievement).toBe('rural_quota');
    expect(track.quotaSharePercent).toBe(35);
  });

  it('её проходной балл ниже, чем в общем конкурсе', () => {
    const program = getProgram('kaznu-medicine')!.program;
    const rural = program.tracks.find((t) => t.id === 'kaznu-med-rural')!;
    const general = program.tracks.find((t) => t.id === 'kaznu-med-grant')!;
    expect(rural.lastPassingScore!).toBeLessThan(general.lastPassingScore!);
  });

  it('закрыта для абитуриента без статуса', () => {
    const cityApplicant = parseProfile({ ...ruralBorderline, achievements: [] });
    const track = getProgram('kaznu-cs')!.program.tracks.find((t) => t.id === 'kaznu-cs-rural')!;
    expect(evaluateTrack(cityApplicant, track).blockers).toContainEqual(
      expect.objectContaining({ code: 'quota_not_available' }),
    );
  });

  it('открыта выпускнику сельской школы и даёт лучший шанс, чем общий конкурс', () => {
    const profile = parseProfile(ruralBorderline);
    const program = getProgram('kaznu-cs')!.program;
    const rural = program.tracks.find((t) => t.id === 'kaznu-cs-rural')!;
    const general = program.tracks.find((t) => t.id === 'kaznu-cs-grant')!;

    expect(evaluateTrack(profile, rural).blockers).toEqual([]);

    const score = evaluateTrack(profile, rural).applicantScore;
    const ruralChance = estimateTrackChance(rural, score);
    const generalChance = estimateTrackChance(general, score);
    expect(ruralChance.probability!).toBeGreaterThan(generalChance.probability!);
  });

  it('не заводится на экономических специальностях — квота на них не распространяется', () => {
    const finance = getProgram('narxoz-finance')!.program;
    expect(finance.tracks.every((track) => track.requiresAchievement === undefined)).toBe(true);
  });

  it('квотный трек попадает в выдачу подбора', () => {
    const { matches } = matchPrograms({ ...ruralBorderline, preferences: { fields: ['it'] } });
    const kaznu = matches.find((m) => m.program.id === 'kaznu-cs');
    expect(kaznu).toBeDefined();
    expect(kaznu!.openTracks.some((t) => t.track.requiresAchievement === 'rural_quota')).toBe(true);
  });
});

describe('«Алтын белгі» как решающий фактор при равенстве баллов', () => {
  const track = getProgram('kaznu-cs')!.program.tracks.find((t) => t.id === 'kaznu-cs-grant')!;
  const passing = track.lastPassingScore!;
  const priority = achievementPriority(['altyn_belgi']);

  it('повышает шанс ровно на отсечке', () => {
    const without = estimateTrackChance(track, passing);
    const with_ = estimateTrackChance(track, passing, { tiebreakPriority: priority });
    expect(with_.probability!).toBeGreaterThan(without.probability!);
  });

  it('почти не влияет при большом запасе — там и так проходят', () => {
    const margin = passing + 30;
    const without = estimateTrackChance(track, margin);
    const with_ = estimateTrackChance(track, margin, { tiebreakPriority: priority });
    expect(with_.probability! - without.probability!).toBeLessThan(0.02);
  });

  it('не спасает при большом недоборе — это не надбавка к баллам', () => {
    const margin = passing - 30;
    const without = estimateTrackChance(track, margin);
    const with_ = estimateTrackChance(track, margin, { tiebreakPriority: priority });
    expect(with_.probability! - without.probability!).toBeLessThan(0.02);
  });

  it('международная олимпиада весит больше, чем «Алтын белгі»', () => {
    const belgi = estimateTrackChance(track, passing, { tiebreakPriority: achievementPriority(['altyn_belgi']) });
    const olympiad = estimateTrackChance(track, passing, {
      tiebreakPriority: achievementPriority(['olympiad_international']),
    });
    expect(olympiad.probability!).toBeGreaterThan(belgi.probability!);
  });

  it('виден в реальной выдаче подбора', () => {
    const base: ApplicantProfileInput = {
      examScores: {
        ent_history_kz: 15, ent_math_literacy: 7, ent_reading_literacy: 7,
        ent_mathematics: 35, ent_informatics: 34,
      },
      entProfilePair: ['ent_mathematics', 'ent_informatics'],
      preferences: { fields: ['it'] },
    };
    const plain = matchPrograms(base).matches.find((m) => m.program.id === 'kaznu-cs')!;
    const decorated = matchPrograms({ ...base, achievements: ['altyn_belgi'] }).matches.find(
      (m) => m.program.id === 'kaznu-cs',
    )!;

    const grantChance = (match: typeof plain): number =>
      match.openTracks.find((t) => t.track.id === 'kaznu-cs-grant')!.chance.probability!;

    expect(grantChance(decorated)).toBeGreaterThan(grantChance(plain));
  });
});
