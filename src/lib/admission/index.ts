/**
 * Движок подбора вузов и планирования поступления для абитуриентов
 * Казахстана и Центральной Азии.
 *
 * ```ts
 * import { matchPrograms, buildRoadmap, parseProfile } from '@locus/admission-engine';
 *
 * const profile = {
 *   examScores: { ent_history_kz: 16, ent_math_literacy: 8, ent_reading_literacy: 8,
 *                 ent_mathematics: 42, ent_informatics: 45 },
 *   entProfilePair: ['ent_mathematics', 'ent_informatics'],
 *   preferences: { fields: ['it'], countries: ['KZ'], languages: ['ru', 'en'] },
 * } as const;
 *
 * const { matches } = matchPrograms(profile, { limit: 5 });
 * const roadmap = buildRoadmap(parseProfile(profile));
 * roadmap.nextAction;
 * ```
 */

export {
  EXAM_CODES, EXAM_SYSTEMS, EXAMS, ENT_CORE_EXAMS, ENT_PROFILE_EXAMS, ENT_MAX_TOTAL,
  ENT_PROFILE_THRESHOLD, ENT_SUBJECT_THRESHOLDS, ENT_GRANT_THRESHOLDS,
  examCodeSchema, examSystemSchema, examTitle, normalizedScore,
} from './types/exams';
export type { ExamCode, ExamDefinition, ExamSystem } from './types/exams';

export {
  CURRENCIES, CURRENCY_SYMBOLS, FALLBACK_FX, currencySchema, moneySchema,
  convert, formatMoney, toUsd,
} from './types/money';
export type { Currency, FxRates, Money } from './types/money';

export {
  CONFIDENCE_LEVELS, CONFIDENCE_TITLES, confidenceSchema, provenanceSchema,
  sourceRefSchema, needsVerification,
} from './types/sources';
export type { Confidence, Provenance, SourceRef } from './types/sources';

export {
  COUNTRIES, COUNTRY_TITLES, LANGUAGES, LANGUAGE_TITLES, STUDY_FIELDS, STUDY_FIELD_TITLES,
  RELATED_FIELDS, STUDY_FORM_TITLES, DEGREE_LEVEL_TITLES, FUNDING_TITLES,
  institutionSchema, programSchema, admissionTrackSchema, countrySchema, languageSchema,
  studyFieldSchema, studyFormSchema, degreeLevelSchema, fundingTypeSchema,
} from './types/institution';
export type {
  AdmissionTrack, Country, DegreeLevel, FundingType, Institution, Language, Localized,
  Program, ProgramWithInstitution, StudyField, StudyForm,
} from './types/institution';

export {
  ACHIEVEMENT_KINDS, ACHIEVEMENT_TITLES, ACHIEVEMENT_PRIORITY,
  applicantProfileSchema, applicantPreferencesSchema, achievementKindSchema, achievementPriority,
} from './types/applicant';
export type {
  AchievementKind, ApplicantPreferences, ApplicantProfile, ApplicantProfileInput,
} from './types/applicant';

export type {
  Blocker, ChanceLevel, MatchFactors, MatchResponse, MatchResult, OpenTrack,
  RejectedMatch, TrackChance,
} from './types/match';

export {
  STEP_KINDS, STEP_KIND_TITLES, STEP_STATUS_TITLES, stepKindSchema,
  admissionCalendarSchema, calendarEntrySchema,
} from './types/roadmap';
export type {
  AdmissionCalendar, CalendarEntry, NextAction, Roadmap, RoadmapStep, StepKind,
  StepStatus, Urgency,
} from './types/roadmap';

export {
  INSTITUTIONS, PROGRAMS, CALENDARS, CITIES, COUNTRIES_IN_DATASET,
  datasetSummary, getInstitution, getProgram, parseInstitutions, parseCalendar,
} from './data/index';
export type { DatasetSummary } from './data/index';
export { INSTITUTIONS_RAW } from './data/institutions';
export { KZ_CALENDAR_2026 } from './data/calendar';

export { checkPreferences, evaluateTrack, entTotal, entThresholdBlockers } from './engine/eligibility';
export type { TrackEvaluation } from './engine/eligibility';
export { CHANCE_LEVEL_TITLES, estimateTrackChance, trackScaleSpan } from './engine/chance';
export { scoreProgram } from './engine/scoring';
export { DEFAULT_WEIGHTS, normalizeWeights, clamp01 } from './engine/weights';
export type { MatchWeights } from './engine/weights';
export { matchPrograms, matchInstitutions, buildApplicationShortlist, parseProfile } from './engine/match';
export type {
  ApplicationShortlist, InstitutionMatch, MatchOptions, ShortlistOptions,
} from './engine/match';
export { buildRoadmap, inferTrackKinds } from './engine/roadmap';
export type { RoadmapOptions } from './engine/roadmap';
