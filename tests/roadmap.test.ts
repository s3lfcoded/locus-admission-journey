import { describe, expect, it } from 'vitest';
import { KZ_CALENDAR_2026, buildRoadmap, inferTrackKinds, parseCalendar, parseProfile } from '../src/lib/admission/index';

const entApplicant = parseProfile({
  examScores: {
    ent_history_kz: 16, ent_math_literacy: 8, ent_reading_literacy: 8,
    ent_mathematics: 42, ent_informatics: 45,
  },
  entProfilePair: ['ent_mathematics', 'ent_informatics'],
});

const internationalApplicant = parseProfile({
  examScores: { ielts: 7, sat_total: 1350, gpa_5: 4.6 },
});

describe('определение траекторий', () => {
  it('узнаёт казахстанский путь по результатам ЕНТ', () => {
    expect(inferTrackKinds(entApplicant)).toContain('ent');
  });

  it('узнаёт международный путь по IELTS и SAT', () => {
    expect(inferTrackKinds(internationalApplicant)).toContain('international');
  });

  it('по умолчанию показывает казахстанский путь, если ничего не сдано', () => {
    expect(inferTrackKinds(parseProfile({}))).toEqual(['ent']);
  });
});

describe('план поступления', () => {
  it('строит шаги в хронологическом порядке', () => {
    const roadmap = buildRoadmap(entApplicant, { asOf: '2026-01-10' });
    const dates = roadmap.steps.map((step) => step.dueAt);
    expect(dates).toEqual([...dates].sort());
    expect(roadmap.intakeYear).toBe(2026);
  });

  it('показывает только шаги релевантной траектории', () => {
    const ent = buildRoadmap(entApplicant, { asOf: '2026-01-10' });
    expect(ent.steps.some((step) => step.id === 'grant-application')).toBe(true);
    expect(ent.steps.some((step) => step.id === 'visa')).toBe(false);

    const intl = buildRoadmap(internationalApplicant, { asOf: '2026-01-10' });
    expect(intl.steps.some((step) => step.id === 'visa')).toBe(true);
    expect(intl.steps.some((step) => step.id === 'grant-application')).toBe(false);
  });

  it('блокирует шаг, пока не выполнен предыдущий', () => {
    const roadmap = buildRoadmap(entApplicant, { asOf: '2026-07-14' });
    const grant = roadmap.steps.find((step) => step.id === 'grant-application')!;
    expect(grant.status).toBe('blocked');

    const ready = buildRoadmap(entApplicant, {
      asOf: '2026-07-14',
      completed: ['ent-registration', 'ent-exam', 'school-certificate'],
    });
    expect(ready.steps.find((step) => step.id === 'grant-application')!.status).toBe('available');
  });

  it('помечает шаг как ещё не открывшийся до начала окна', () => {
    const roadmap = buildRoadmap(entApplicant, {
      asOf: '2026-07-01',
      completed: ['ent-registration', 'ent-exam', 'school-certificate'],
    });
    expect(roadmap.steps.find((step) => step.id === 'grant-application')!.status).toBe('upcoming');
  });

  it('считает просроченные шаги и предупреждает о критичных', () => {
    const roadmap = buildRoadmap(entApplicant, { asOf: '2026-08-01' });
    expect(roadmap.overdue.length).toBeGreaterThan(0);
    expect(roadmap.warnings.join(' ')).toMatch(/Пропущены критичные шаги/);
  });

  it('предупреждает о неподтверждённых датах календаря', () => {
    const roadmap = buildRoadmap(entApplicant, { asOf: '2026-01-10' });
    expect(roadmap.warnings.join(' ')).toMatch(/сверк|подтвержд/i);
  });
});

describe('следующее действие', () => {
  it('выдаёт ровно одно ближайшее дело', () => {
    const roadmap = buildRoadmap(entApplicant, { asOf: '2026-01-10' });
    expect(roadmap.nextAction).not.toBeNull();
    expect(roadmap.nextAction!.step.status).toBe('available');
    expect(roadmap.nextAction!.why.length).toBeGreaterThan(0);
  });

  it('повышает срочность при приближении дедлайна', () => {
    const far = buildRoadmap(entApplicant, { asOf: '2026-01-10' });
    const near = buildRoadmap(entApplicant, {
      asOf: '2026-07-15',
      completed: ['ent-registration', 'ent-exam', 'school-certificate'],
    });

    expect(far.nextAction!.urgency).toBe('later');
    expect(near.nextAction!.urgency).toBe('now');
    expect(near.nextAction!.step.id).toBe('grant-application');
    expect(near.nextAction!.why).toMatch(/Осталось|Последний день/);
  });

  it('ведёт абитуриента по цепочке: выполненный шаг уступает место следующему', () => {
    const first = buildRoadmap(entApplicant, { asOf: '2026-02-01' });
    const after = buildRoadmap(entApplicant, { asOf: '2026-02-01', completed: [first.nextAction!.step.id] });
    expect(after.nextAction!.step.id).not.toBe(first.nextAction!.step.id);
  });
});

describe('календарь как данные', () => {
  it('проходит валидацию схемы', () => {
    expect(() => parseCalendar(KZ_CALENDAR_2026)).not.toThrow();
  });

  it('несёт источники на даты подачи на грант', () => {
    const calendar = parseCalendar(KZ_CALENDAR_2026);
    expect(calendar.provenance.sources.length).toBeGreaterThan(0);
    const grant = calendar.entries.find((entry) => entry.id === 'grant-application')!;
    expect(grant.opensAt).toBe('2026-07-13');
    expect(grant.dueAt).toBe('2026-07-20');
  });

  it('позволяет подключить чужой календарь, не трогая движок', () => {
    const custom = {
      ...KZ_CALENDAR_2026,
      id: 'kz-2027',
      intakeYear: 2027,
      entries: [
        {
          id: 'only-step', kind: 'exam', title: 'Единственный шаг',
          description: 'Проверка подмены календаря', dueAt: '2027-05-01', appliesTo: ['ent'],
        },
      ],
    };
    const roadmap = buildRoadmap(entApplicant, { calendar: parseCalendar(custom), asOf: '2027-01-01' });
    expect(roadmap.intakeYear).toBe(2027);
    expect(roadmap.steps).toHaveLength(1);
    expect(roadmap.nextAction!.step.id).toBe('only-step');
  });
});
