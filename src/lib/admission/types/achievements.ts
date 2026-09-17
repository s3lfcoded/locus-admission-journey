import { z } from 'zod';

export const ACHIEVEMENT_KINDS = [
  'altyn_belgi',
  'honours_certificate',
  'olympiad_republican',
  'olympiad_international',
  'presidential_scholarship',
  'rural_quota',
  'volunteering',
  'portfolio',
] as const;
export const achievementKindSchema = z.enum(ACHIEVEMENT_KINDS);
export type AchievementKind = z.infer<typeof achievementKindSchema>;

export const ACHIEVEMENT_TITLES: Readonly<Record<AchievementKind, string>> = {
  altyn_belgi: 'Знак «Алтын белгі»',
  honours_certificate: 'Аттестат с отличием',
  olympiad_republican: 'Призёр республиканской олимпиады',
  olympiad_international: 'Призёр международной олимпиады',
  presidential_scholarship: 'Президентская стипендия',
  rural_quota: 'Сельская квота',
  volunteering: 'Волонтёрская деятельность',
  portfolio: 'Портфолио проектов',
};

/**
 * В отличие от России, в Казахстане достижения не прибавляют баллы к ЕНТ.
 * «Алтын белгі» и победы в олимпиадах дают приоритет при равном балле и доступ
 * к отдельным квотам, а не арифметическую надбавку. Модель это отражает:
 * вес — это приоритет в очереди, а не баллы.
 */
export const ACHIEVEMENT_PRIORITY: Readonly<Record<AchievementKind, number>> = {
  olympiad_international: 5,
  olympiad_republican: 4,
  altyn_belgi: 3,
  presidential_scholarship: 3,
  honours_certificate: 2,
  rural_quota: 2,
  portfolio: 1,
  volunteering: 1,
};
