import { z } from 'zod';
import { examCodeSchema } from './exams';
import { moneySchema } from './money';
import { provenanceSchema } from './sources';

const idSchema = z.string().min(2).regex(/^[a-z0-9][a-z0-9-]*$/, 'id — kebab-case латиницей');

/** Страны, которые рассматривает абитуриент Центральной Азии. */
export const COUNTRIES = ['KZ', 'RU', 'KG', 'UZ', 'TR', 'DE', 'KR', 'US', 'GB', 'CN', 'AE', 'CZ', 'PL', 'IT'] as const;
export const countrySchema = z.enum(COUNTRIES);
export type Country = z.infer<typeof countrySchema>;

export const COUNTRY_TITLES: Readonly<Record<Country, string>> = {
  KZ: 'Казахстан', RU: 'Россия', KG: 'Кыргызстан', UZ: 'Узбекистан', TR: 'Турция',
  DE: 'Германия', KR: 'Южная Корея', US: 'США', GB: 'Великобритания', CN: 'Китай',
  AE: 'ОАЭ', CZ: 'Чехия', PL: 'Польша', IT: 'Италия',
};

/** Язык обучения — для Казахстана это реальный фильтр, а не деталь. */
export const LANGUAGES = ['kk', 'ru', 'en', 'tr', 'de', 'ko', 'zh'] as const;
export const languageSchema = z.enum(LANGUAGES);
export type Language = z.infer<typeof languageSchema>;

export const LANGUAGE_TITLES: Readonly<Record<Language, string>> = {
  kk: 'Казахский', ru: 'Русский', en: 'Английский', tr: 'Турецкий',
  de: 'Немецкий', ko: 'Корейский', zh: 'Китайский',
};

export const STUDY_FIELDS = [
  'it', 'engineering', 'physics_math', 'natural_sciences', 'medicine', 'economics',
  'management', 'law', 'humanities', 'social_sciences', 'design', 'education',
  'agriculture', 'oil_and_gas', 'logistics',
] as const;
export const studyFieldSchema = z.enum(STUDY_FIELDS);
export type StudyField = z.infer<typeof studyFieldSchema>;

export const STUDY_FIELD_TITLES: Readonly<Record<StudyField, string>> = {
  it: 'ИТ и программирование', engineering: 'Инженерия и технологии',
  physics_math: 'Физика и математика', natural_sciences: 'Естественные науки',
  medicine: 'Медицина и здравоохранение', economics: 'Экономика и финансы',
  management: 'Менеджмент и бизнес', law: 'Юриспруденция',
  humanities: 'Гуманитарные науки', social_sciences: 'Социальные науки',
  design: 'Дизайн и медиа', education: 'Образование и педагогика',
  agriculture: 'Агро и биотехнологии', oil_and_gas: 'Нефть и газ',
  logistics: 'Логистика и транспорт',
};

export const RELATED_FIELDS: Readonly<Record<StudyField, readonly StudyField[]>> = {
  it: ['engineering', 'physics_math'],
  engineering: ['it', 'physics_math', 'oil_and_gas'],
  physics_math: ['it', 'engineering', 'natural_sciences'],
  natural_sciences: ['physics_math', 'medicine', 'agriculture'],
  medicine: ['natural_sciences', 'agriculture'],
  economics: ['management', 'social_sciences', 'logistics'],
  management: ['economics', 'social_sciences', 'logistics'],
  law: ['social_sciences', 'humanities'],
  humanities: ['social_sciences', 'education', 'design'],
  social_sciences: ['humanities', 'economics', 'law'],
  design: ['humanities', 'it'],
  education: ['humanities', 'social_sciences'],
  agriculture: ['natural_sciences', 'medicine'],
  oil_and_gas: ['engineering', 'natural_sciences'],
  logistics: ['management', 'economics', 'engineering'],
};

export const degreeLevelSchema = z.enum(['bachelor', 'specialist', 'foundation']);
export type DegreeLevel = z.infer<typeof degreeLevelSchema>;

export const studyFormSchema = z.enum(['full_time', 'part_time', 'extramural', 'online']);
export type StudyForm = z.infer<typeof studyFormSchema>;

export const fundingTypeSchema = z.enum(['grant', 'paid', 'scholarship']);
export type FundingType = z.infer<typeof fundingTypeSchema>;

export const FUNDING_TITLES: Readonly<Record<FundingType, string>> = {
  grant: 'Государственный грант',
  paid: 'Платное отделение',
  scholarship: 'Стипендия вуза',
};

/** Одно требование: экзамен и минимальный балл по его собственной шкале. */
export const examRequirementSchema = z.object({
  exam: examCodeSchema,
  min: z.number(),
});
export type ExamRequirement = z.infer<typeof examRequirementSchema>;

const localizedSchema = z.object({
  ru: z.string().min(1),
  kk: z.string().min(1),
  en: z.string().min(1),
});
export type Localized = z.infer<typeof localizedSchema>;

/**
 * Траектория поступления — отдельный способ попасть на программу.
 *
 * Одна программа обычно имеет несколько: грант по ЕНТ, платное по ЕНТ,
 * международный трек по SAT/IELTS. У каждой свои требования и свой конкурс,
 * поэтому шансы считаются по каждой отдельно, а не усредняются.
 */
export const admissionTrackSchema = z
  .object({
    id: idSchema,
    kind: z.enum(['ent', 'international', 'ege']),
    title: localizedSchema,
    fundingType: fundingTypeSchema,
    /** Требования, которые должны выполняться все. */
    required: z.array(examRequirementSchema).default([]),
    /** Группы «достаточно любого из»: IELTS 6.5 ИЛИ TOEFL 79. */
    anyOf: z.array(z.array(examRequirementSchema).min(2)).default([]),
    /** Пара профильных предметов ЕНТ, которую принимает вуз на эту программу. */
    entProfilePair: z.tuple([examCodeSchema, examCodeSchema]).optional(),
    /** Минимальный суммарный балл ЕНТ (из 140). */
    entMinTotal: z.number().int().min(0).max(140).optional(),
    /**
     * Экзамен, в шкале которого выражен lastPassingScore для неЕНТ-треков.
     * У треков ЕНТ шкалой служит суммарный балл из 140, поэтому поле не нужно.
     */
    scoreExam: examCodeSchema.optional(),
    /** Проходной балл прошлой кампании по шкале этого трека. null — не публиковался. */
    lastPassingScore: z.number().nullable().default(null),
    /** Количество мест. null — не публикуется. */
    places: z.number().int().min(0).nullable().default(null),
  })
  .superRefine((track, ctx) => {
    if (track.kind === 'ent' && track.entProfilePair === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Трек ЕНТ ${track.id} без пары профильных предметов` });
    }
    if (track.kind !== 'ent' && track.entMinTotal !== undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Трек ${track.id} не по ЕНТ, но задан entMinTotal` });
    }
    if (track.kind !== 'ent' && track.lastPassingScore !== null && track.scoreExam === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Трек ${track.id}: задан проходной балл, но не указано, в шкале какого экзамена`,
      });
    }
    if (track.required.length === 0 && track.anyOf.length === 0 && track.entMinTotal === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Трек ${track.id} не содержит ни одного требования` });
    }
  });
export type AdmissionTrack = z.infer<typeof admissionTrackSchema>;

export const programSchema = z
  .object({
    id: idSchema,
    institutionId: idSchema,
    title: localizedSchema,
    /** Код программы: 6B06103 в Казахстане, 09.03.04 в России. */
    programCode: z.string().min(2).optional(),
    degreeLevel: degreeLevelSchema,
    studyForm: studyFormSchema,
    durationYears: z.number().min(1).max(7),
    fields: z.array(studyFieldSchema).min(1),
    languages: z.array(languageSchema).min(1),
    tracks: z.array(admissionTrackSchema).min(1),
    /** Стоимость года обучения. null — только грант или бесплатно. */
    tuitionPerYear: moneySchema.nullable(),
    keywords: z.array(z.string().min(2)).default([]),
    url: z.string().url().optional(),
    provenance: provenanceSchema,
  })
  .superRefine((program, ctx) => {
    const ids = new Set<string>();
    for (const track of program.tracks) {
      if (ids.has(track.id)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Дублируется id трека: ${track.id}` });
      }
      ids.add(track.id);
    }
    const hasPaid = program.tracks.some((track) => track.fundingType === 'paid');
    if (hasPaid && program.tuitionPerYear === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${program.id}: есть платный трек, но не указана стоимость` });
    }
  });
export type Program = z.infer<typeof programSchema>;

export const institutionSchema = z.object({
  id: idSchema,
  name: localizedSchema,
  shortName: z.string().min(2),
  country: countrySchema,
  city: z.string().min(2),
  ownership: z.enum(['state', 'private', 'autonomous', 'international']),
  foundedYear: z.number().int().min(1000).max(2100),
  website: z.string().url(),
  languagesOfInstruction: z.array(languageSchema).min(1),
  hasDormitory: z.boolean(),
  /** Позиция в QS World University Rankings. null — не входит. */
  qsWorldRank: z.number().int().min(1).nullable().default(null),
  programs: z.array(programSchema).min(1),
});
export type Institution = z.infer<typeof institutionSchema>;

export interface ProgramWithInstitution {
  readonly program: Program;
  readonly institution: Institution;
}

export const STUDY_FORM_TITLES: Readonly<Record<StudyForm, string>> = {
  full_time: 'Очная', part_time: 'Очно-заочная', extramural: 'Заочная', online: 'Онлайн',
};

export const DEGREE_LEVEL_TITLES: Readonly<Record<DegreeLevel, string>> = {
  bachelor: 'Бакалавриат', specialist: 'Специалитет', foundation: 'Foundation (подготовительный год)',
};
