import { applicantProfileSchema, type ApplicantProfile, type ApplicantProfileInput } from '../types/applicant';
import type { Institution, ProgramWithInstitution } from '../types/institution';
import type { FxRates } from '../types/money';
import type { Blocker, MatchResponse, MatchResult, RejectedMatch } from '../types/match';
import { PROGRAMS } from '../data/index';
import { checkPreferences, evaluateTrack } from './eligibility';
import { scoreProgram } from './scoring';
import { DEFAULT_WEIGHTS, normalizeWeights, type MatchWeights } from './weights';

export interface MatchOptions {
  readonly dataset?: readonly ProgramWithInstitution[];
  readonly limit?: number;
  readonly weights?: Partial<MatchWeights>;
  readonly includeRejected?: boolean;
  readonly minMatchScore?: number;
  /** Курсы валют для сравнения стоимости. По умолчанию — запасная таблица. */
  readonly fx?: FxRates;
  /** Показывать только программы с подтверждёнными данными. */
  readonly verifiedOnly?: boolean;
}

/** При равном балле вперёд идут данные, которым можно доверять. */
const CONFIDENCE_RANK: Readonly<Record<MatchResult['confidence'], number>> = {
  verified: 2,
  reported: 1,
  estimated: 0,
};

function compareMatches(a: MatchResult, b: MatchResult): number {
  if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;

  const byConfidence = CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence];
  if (byConfidence !== 0) return byConfidence;

  const aBest = a.openTracks[0]?.chance.probability ?? 0;
  const bBest = b.openTracks[0]?.chance.probability ?? 0;
  if (bBest !== aBest) return bBest - aBest;

  return a.program.title.ru.localeCompare(b.program.title.ru, 'ru');
}

/**
 * Подбор программ под профиль абитуриента.
 *
 * Программа отбрасывается только тогда, когда закрыты все её траектории
 * поступления или не выполнены предпочтения. Если хотя бы один путь открыт —
 * программа попадает в выдачу, а закрытые пути остаются видимыми в closedTracks.
 */
export function matchPrograms(profileInput: ApplicantProfileInput, options: MatchOptions = {}): MatchResponse {
  const profile = applicantProfileSchema.parse(profileInput);
  const dataset = options.dataset ?? PROGRAMS;
  const weights = options.weights === undefined ? DEFAULT_WEIGHTS : normalizeWeights(options.weights);
  const includeRejected = options.includeRejected ?? true;

  const matches: MatchResult[] = [];
  const rejected: RejectedMatch[] = [];

  for (const entry of dataset) {
    const { program, institution } = entry;

    if (options.verifiedOnly === true && program.provenance.confidence !== 'verified') continue;

    const blockers: Blocker[] = [...checkPreferences(profile, program, institution, options.fx)];

    if (blockers.length === 0) {
      const anyOpen = program.tracks.some((track) => evaluateTrack(profile, track).blockers.length === 0);
      if (!anyOpen) {
        for (const track of program.tracks) {
          blockers.push(...evaluateTrack(profile, track).blockers);
        }
      }
    }

    if (blockers.length > 0) {
      if (includeRejected) rejected.push({ program, institution, blockers });
      continue;
    }

    matches.push(scoreProgram(profile, entry, weights, options.fx));
  }

  const threshold = options.minMatchScore ?? 0;
  const ranked = matches.filter((match) => match.matchScore >= threshold).sort(compareMatches);

  return {
    matches: options.limit === undefined ? ranked : ranked.slice(0, options.limit),
    rejected,
    totalConsidered: dataset.length,
  };
}

export interface InstitutionMatch {
  readonly institution: Institution;
  readonly bestMatch: MatchResult;
  readonly matches: readonly MatchResult[];
}

/** Та же выдача, сгруппированная по вузам — формат карточек в интерфейсе. */
export function matchInstitutions(
  profileInput: ApplicantProfileInput,
  options: MatchOptions = {},
): readonly InstitutionMatch[] {
  const { matches } = matchPrograms(profileInput, { ...options, limit: undefined });

  const grouped = new Map<string, MatchResult[]>();
  for (const match of matches) {
    const bucket = grouped.get(match.institution.id);
    if (bucket === undefined) grouped.set(match.institution.id, [match]);
    else bucket.push(match);
  }

  const result: InstitutionMatch[] = [];
  for (const bucket of grouped.values()) {
    const sorted = [...bucket].sort(compareMatches);
    const best = sorted[0];
    if (best === undefined) continue;
    result.push({ institution: best.institution, bestMatch: best, matches: sorted });
  }

  result.sort((a, b) => compareMatches(a.bestMatch, b.bestMatch));
  return options.limit === undefined ? result : result.slice(0, options.limit);
}

export interface ApplicationShortlist {
  readonly safe: readonly MatchResult[];
  readonly target: readonly MatchResult[];
  readonly reach: readonly MatchResult[];
}

export interface ShortlistOptions extends MatchOptions {
  readonly perBucket?: number;
  readonly maxPerInstitution?: number;
}

/** Сбалансированный шорт-лист: запасные варианты, целевые и амбициозные. */
export function buildApplicationShortlist(
  profileInput: ApplicantProfileInput,
  options: ShortlistOptions = {},
): ApplicationShortlist {
  const perBucket = options.perBucket ?? 3;
  const maxPerInstitution = options.maxPerInstitution ?? 2;
  const { matches } = matchPrograms(profileInput, { ...options, limit: undefined });

  const used = new Map<string, number>();
  const safe: MatchResult[] = [];
  const target: MatchResult[] = [];
  const reach: MatchResult[] = [];

  for (const match of matches) {
    const count = used.get(match.institution.id) ?? 0;
    if (count >= maxPerInstitution) continue;

    const level = match.openTracks[0]?.chance.level ?? 'unknown';
    const bucket =
      level === 'safe' || level === 'likely' ? safe : level === 'reach' || level === 'unlikely' ? reach : target;
    if (bucket.length >= perBucket) continue;

    bucket.push(match);
    used.set(match.institution.id, count + 1);
  }

  return { safe, target, reach };
}

export function parseProfile(input: ApplicantProfileInput): ApplicantProfile {
  return applicantProfileSchema.parse(input);
}
