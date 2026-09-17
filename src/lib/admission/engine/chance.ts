import { ENT_MAX_TOTAL, EXAMS } from '../types/exams';
import type { AdmissionTrack } from '../types/institution';
import type { ChanceLevel, TrackChance } from '../types/match';

/**
 * Ширина шкалы траектории. Без неё сравнение бессмысленно: запас в 5 баллов
 * из 140 по ЕНТ и 5 баллов из 1600 по SAT — совершенно разные вещи.
 */
export function trackScaleSpan(track: AdmissionTrack): number {
  if (track.kind === 'ent') return ENT_MAX_TOTAL;
  if (track.scoreExam !== undefined) {
    const exam = EXAMS[track.scoreExam];
    return exam.max - exam.min;
  }
  return 0;
}

function levelFromRelativeMargin(relative: number): ChanceLevel {
  if (relative >= 0.12) return 'safe';
  if (relative >= 0.05) return 'likely';
  if (relative >= -0.03) return 'target';
  if (relative >= -0.12) return 'reach';
  return 'unlikely';
}

/**
 * Шансы по одной траектории. Вероятность сглажена логистической кривой:
 * проходной балл прошлого года — ориентир, а не порог, и подавать его как
 * порог означало бы обманывать абитуриента.
 */
/**
 * Максимальный сдвиг вероятности от индивидуальных достижений — ровно на отсечке.
 * «Алтын белгі» и олимпиады в Казахстане не прибавляют баллов к ЕНТ: они решают
 * исход при равенстве баллов, поэтому эффект сосредоточен вокруг проходного и
 * исчезает при заметном запасе или недоборе.
 */
const TIEBREAK_MAX_BOOST = 0.12;

/** Ширина зоны «равенства баллов» в долях шкалы траектории. */
const TIEBREAK_WIDTH = 0.02;

/** Приоритет, при котором тайбрейк даёт полный эффект (призёр международной олимпиады). */
const TIEBREAK_FULL_PRIORITY = 5;

export interface ChanceContext {
  /** Суммарный приоритет достижений — см. achievementPriority(). */
  readonly tiebreakPriority?: number;
}

export function estimateTrackChance(
  track: AdmissionTrack,
  applicantScore: number | null,
  context: ChanceContext = {},
): TrackChance {
  const { lastPassingScore, places, id } = track;

  if (applicantScore === null || lastPassingScore === null) {
    return { trackId: id, level: 'unknown', probability: null, margin: null, passingScore: lastPassingScore, places };
  }

  const span = trackScaleSpan(track);
  if (span <= 0) {
    return { trackId: id, level: 'unknown', probability: null, margin: null, passingScore: lastPassingScore, places };
  }

  const margin = applicantScore - lastPassingScore;
  const relative = margin / span;
  // 5% шкалы — характерный разброс проходного балла между кампаниями.
  const base = 1 / (1 + Math.exp(-relative / 0.05));

  // Гауссиана с центром в нуле: на самой отсечке достижения решают, при большом
  // запасе абитуриент проходит и без них, при большом недоборе они не спасают.
  const priority = Math.max(0, context.tiebreakPriority ?? 0);
  const proximity = Math.exp(-((relative / TIEBREAK_WIDTH) ** 2));
  const boost =
    TIEBREAK_MAX_BOOST * Math.min(1, priority / TIEBREAK_FULL_PRIORITY) * proximity;

  const probability = Math.round((base + boost * (1 - base)) * 100) / 100;

  return {
    trackId: id,
    level: levelFromRelativeMargin(relative),
    probability,
    margin,
    passingScore: lastPassingScore,
    places,
  };
}

export const CHANCE_LEVEL_TITLES: Readonly<Record<ChanceLevel, string>> = {
  safe: 'Запасной вариант',
  likely: 'Высокие шансы',
  target: 'Целевой вариант',
  reach: 'На грани',
  unlikely: 'Маловероятно',
  unknown: 'Проходной балл не публиковался',
};
