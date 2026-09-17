import { admissionCalendarSchema, type AdmissionCalendar, type NextAction, type Roadmap, type RoadmapStep, type StepStatus, type Urgency } from '../types/roadmap';
import { needsVerification } from '../types/sources';
import type { ApplicantProfile } from '../types/applicant';
import type { AdmissionTrack } from '../types/institution';
import { KZ_CALENDAR_2026 } from '../data/calendar';

const MS_PER_DAY = 86_400_000;

function parseDate(iso: string): number {
  return Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  return Math.round((parseDate(to) - parseDate(from)) / MS_PER_DAY);
}

export interface RoadmapOptions {
  /** Календарь кампании. По умолчанию — Казахстан 2026. */
  readonly calendar?: AdmissionCalendar;
  /** Дата расчёта. По умолчанию — сегодня. Параметр нужен для тестов и превью. */
  readonly asOf?: string;
  /** Шаги, которые абитуриент уже выполнил. */
  readonly completed?: readonly string[];
  /** Какие траектории рассматриваются. По умолчанию выводятся из профиля. */
  readonly trackKinds?: readonly AdmissionTrack['kind'][];
}

/** Какие траектории релевантны абитуриенту, если он не указал явно. */
export function inferTrackKinds(profile: ApplicantProfile): AdmissionTrack['kind'][] {
  const kinds = new Set<AdmissionTrack['kind']>();
  const scores = profile.examScores;

  if (profile.entProfilePair !== undefined || Object.keys(scores).some((code) => code.startsWith('ent_'))) {
    kinds.add('ent');
  }
  if (scores.ielts !== undefined || scores.toefl_ibt !== undefined || scores.sat_total !== undefined || scores.act_composite !== undefined) {
    kinds.add('international');
  }
  if (Object.keys(scores).some((code) => code.startsWith('ege_'))) {
    kinds.add('ege');
  }
  // Ничего не сдано — показываем казахстанский путь как основной.
  if (kinds.size === 0) kinds.add('ent');
  return [...kinds];
}

function statusOf(
  entry: { id: string; opensAt?: string; dueAt: string; dependsOn: string[] },
  asOf: string,
  completed: ReadonlySet<string>,
): StepStatus {
  if (completed.has(entry.id)) return 'done';
  if (daysBetween(asOf, entry.dueAt) < 0) return 'overdue';
  if (entry.dependsOn.some((id) => !completed.has(id))) return 'blocked';
  if (entry.opensAt !== undefined && daysBetween(asOf, entry.opensAt) > 0) return 'upcoming';
  return 'available';
}

function urgencyOf(daysLeft: number): Urgency {
  if (daysLeft < 0) return 'overdue';
  if (daysLeft <= 7) return 'now';
  if (daysLeft <= 30) return 'soon';
  return 'later';
}

function explain(step: RoadmapStep): string {
  if (step.status === 'overdue') {
    return `Срок прошёл ${Math.abs(step.daysLeft)} дн. назад — проверьте, возможна ли подача с опозданием`;
  }
  if (step.daysLeft <= 7) {
    return step.daysLeft === 0
      ? 'Последний день — дальше окно закроется'
      : `Осталось ${step.daysLeft} дн. — это ближайший критичный дедлайн`;
  }
  if (step.status === 'blocked') {
    return 'Ждёт предыдущий шаг, но начинать готовиться можно уже сейчас';
  }
  return `До дедлайна ${step.daysLeft} дн. — следующий шаг по плану`;
}

/**
 * Строит план поступления: календарь шагов со статусами и одно ближайшее действие.
 *
 * Шаги приходят из данных календаря, а не из кода, поэтому кампанию другой
 * страны или другого года можно подключить, не трогая движок.
 */
export function buildRoadmap(profile: ApplicantProfile, options: RoadmapOptions = {}): Roadmap {
  const calendar = admissionCalendarSchema.parse(options.calendar ?? KZ_CALENDAR_2026);
  const asOf = options.asOf ?? today();
  const completed = new Set(options.completed ?? []);
  const kinds = new Set(options.trackKinds ?? inferTrackKinds(profile));

  const steps: RoadmapStep[] = calendar.entries
    .filter((entry) => entry.appliesTo.some((kind) => kinds.has(kind)))
    .map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      description: entry.description,
      opensAt: entry.opensAt ?? null,
      dueAt: entry.dueAt,
      dependsOn: entry.dependsOn,
      critical: entry.critical,
      status: statusOf(entry, asOf, completed),
      daysLeft: daysBetween(asOf, entry.dueAt),
    }))
    .sort((a, b) => (a.dueAt === b.dueAt ? a.id.localeCompare(b.id) : a.dueAt.localeCompare(b.dueAt)));

  const overdue = steps.filter((step) => step.status === 'overdue');

  // Ближайшее действие: сначала то, что можно делать прямо сейчас, критичное — вперёд.
  const actionable = steps.filter((step) => step.status === 'available');
  const pick =
    actionable.find((step) => step.critical) ??
    actionable[0] ??
    steps.find((step) => step.status === 'blocked') ??
    steps.find((step) => step.status === 'upcoming') ??
    null;

  const nextAction: NextAction | null =
    pick === null ? null : { step: pick, why: explain(pick), urgency: urgencyOf(pick.daysLeft) };

  const warnings: string[] = [];
  if (overdue.some((step) => step.critical)) {
    warnings.push(`Пропущены критичные шаги: ${overdue.filter((s) => s.critical).map((s) => s.title).join(', ')}`);
  }
  if (needsVerification(calendar.provenance)) {
    warnings.push(
      calendar.provenance.caveat ?? 'Даты календаря не подтверждены официальным источником — сверьте с приказом',
    );
  }

  return { intakeYear: calendar.intakeYear, asOf, steps, nextAction, overdue, warnings };
}
