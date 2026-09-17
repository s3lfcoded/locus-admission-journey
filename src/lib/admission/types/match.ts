import type { ExamCode } from './exams';
import type { AdmissionTrack, Institution, Program } from './institution';
import type { Money } from './money';
import type { Confidence } from './sources';

/** Формальная причина, по которой траектория недоступна. */
export interface Blocker {
  readonly code:
    | 'missing_exam'
    | 'exam_below_min'
    | 'ent_total_below_min'
    | 'ent_profile_pair_mismatch'
    | 'any_of_unsatisfied'
    | 'country_not_allowed'
    | 'city_not_allowed'
    | 'language_not_allowed'
    | 'funding_not_allowed'
    | 'study_form_not_allowed'
    | 'degree_level_not_allowed'
    | 'tuition_too_expensive'
    | 'no_dormitory'
    | 'quota_not_available';
  readonly message: string;
  readonly exam?: ExamCode;
}

export type ChanceLevel = 'safe' | 'likely' | 'target' | 'reach' | 'unlikely' | 'unknown';

/** Оценка шансов по одной траектории. */
export interface TrackChance {
  readonly trackId: string;
  readonly level: ChanceLevel;
  /** 0..1. null — проходной балл не публиковался, оценить нечем. */
  readonly probability: number | null;
  /** Запас над проходным баллом в шкале этой траектории. */
  readonly margin: number | null;
  readonly passingScore: number | null;
  readonly places: number | null;
}

/** Траектория, доступная абитуриенту, с оценкой шансов. */
export interface OpenTrack {
  readonly track: AdmissionTrack;
  readonly chance: TrackChance;
  /** Сумма баллов абитуриента в шкале этой траектории. */
  readonly applicantScore: number | null;
}

export interface MatchFactors {
  readonly admissionRealism: number;
  readonly fieldMatch: number;
  readonly affordability: number;
  readonly location: number;
  readonly language: number;
  readonly prestige: number;
}

export interface MatchResult {
  readonly program: Program;
  readonly institution: Institution;
  readonly matchScore: number;
  readonly factors: MatchFactors;
  /** Доступные траектории, лучшая — первая. */
  readonly openTracks: readonly OpenTrack[];
  /** Траектории, закрытые формально, с причинами. */
  readonly closedTracks: readonly { readonly track: AdmissionTrack; readonly blockers: readonly Blocker[] }[];
  readonly tuitionPerYear: Money | null;
  /** Насколько можно доверять цифрам этой программы. */
  readonly confidence: Confidence;
  readonly reasons: readonly string[];
  readonly warnings: readonly string[];
}

export interface RejectedMatch {
  readonly program: Program;
  readonly institution: Institution;
  readonly blockers: readonly Blocker[];
}

export interface MatchResponse {
  readonly matches: readonly MatchResult[];
  readonly rejected: readonly RejectedMatch[];
  readonly totalConsidered: number;
}
