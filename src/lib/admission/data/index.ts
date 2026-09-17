import { z } from 'zod';
import { institutionSchema, type Institution, type ProgramWithInstitution } from '../types/institution';
import { admissionCalendarSchema, type AdmissionCalendar } from '../types/roadmap';
import type { Confidence } from '../types/sources';
import { INSTITUTIONS_RAW } from './institutions';
import { KZ_CALENDAR_2026 } from './calendar';

const datasetSchema = z
  .array(institutionSchema)
  .min(1)
  .superRefine((institutions, ctx) => {
    const institutionIds = new Set<string>();
    const programIds = new Set<string>();
    const trackIds = new Set<string>();

    for (const institution of institutions) {
      if (institutionIds.has(institution.id)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Дублируется id вуза: ${institution.id}` });
      }
      institutionIds.add(institution.id);

      for (const program of institution.programs) {
        if (programIds.has(program.id)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Дублируется id программы: ${program.id}` });
        }
        programIds.add(program.id);

        if (program.institutionId !== institution.id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Программа ${program.id} ссылается на вуз ${program.institutionId}, а лежит в ${institution.id}`,
          });
        }

        if (!program.languages.every((lang) => institution.languagesOfInstruction.includes(lang))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Программа ${program.id} ведётся на языке, которого нет у вуза ${institution.id}`,
          });
        }

        for (const track of program.tracks) {
          if (trackIds.has(track.id)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Дублируется id траектории: ${track.id}` });
          }
          trackIds.add(track.id);
        }
      }
    }
  });

export function parseInstitutions(raw: unknown): Institution[] {
  return datasetSchema.parse(raw);
}

export function parseCalendar(raw: unknown): AdmissionCalendar {
  return admissionCalendarSchema.parse(raw);
}

export const INSTITUTIONS: readonly Institution[] = Object.freeze(parseInstitutions(INSTITUTIONS_RAW));

export const PROGRAMS: readonly ProgramWithInstitution[] = Object.freeze(
  INSTITUTIONS.flatMap((institution) => institution.programs.map((program) => ({ program, institution }))),
);

export const CALENDARS: readonly AdmissionCalendar[] = Object.freeze([parseCalendar(KZ_CALENDAR_2026)]);

const institutionsById = new Map(INSTITUTIONS.map((institution) => [institution.id, institution]));
const programsById = new Map(PROGRAMS.map((entry) => [entry.program.id, entry]));

export function getInstitution(id: string): Institution | undefined {
  return institutionsById.get(id);
}

export function getProgram(id: string): ProgramWithInstitution | undefined {
  return programsById.get(id);
}

export const CITIES: readonly string[] = Object.freeze(
  [...new Set(INSTITUTIONS.map((institution) => institution.city))].sort((a, b) => a.localeCompare(b, 'ru')),
);

export const COUNTRIES_IN_DATASET = Object.freeze([
  ...new Set(INSTITUTIONS.map((institution) => institution.country)),
]);

export interface DatasetSummary {
  readonly institutions: number;
  readonly programs: number;
  readonly countries: number;
  readonly cities: number;
  /** Сколько программ на каждом уровне достоверности — это метрика качества датасета. */
  readonly byConfidence: Readonly<Record<Confidence, number>>;
}

export function datasetSummary(): DatasetSummary {
  const byConfidence: Record<Confidence, number> = { verified: 0, reported: 0, estimated: 0 };
  for (const { program } of PROGRAMS) {
    byConfidence[program.provenance.confidence] += 1;
  }
  return {
    institutions: INSTITUTIONS.length,
    programs: PROGRAMS.length,
    countries: COUNTRIES_IN_DATASET.length,
    cities: CITIES.length,
    byConfidence,
  };
}
