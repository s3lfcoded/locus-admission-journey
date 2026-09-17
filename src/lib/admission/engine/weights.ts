import type { MatchFactors } from '../types/match';

export type MatchWeights = Readonly<Record<keyof MatchFactors, number>>;

/**
 * Язык обучения вынесен в отдельный фактор и весит заметно: для абитуриента
 * Центральной Азии это не деталь, а условие, при котором учёба вообще возможна.
 */
export const DEFAULT_WEIGHTS: MatchWeights = {
  admissionRealism: 0.32,
  fieldMatch: 0.22,
  affordability: 0.15,
  location: 0.12,
  language: 0.11,
  prestige: 0.08,
};

export function normalizeWeights(weights: Partial<MatchWeights> = {}): MatchWeights {
  const merged = { ...DEFAULT_WEIGHTS, ...weights };
  const keys = Object.keys(DEFAULT_WEIGHTS) as (keyof MatchFactors)[];

  for (const key of keys) {
    if (!Number.isFinite(merged[key])) {
      throw new Error(`Вес «${key}» должен быть конечным числом, получено: ${merged[key]}`);
    }
  }

  const total = keys.reduce((sum, key) => sum + Math.max(0, merged[key]), 0);
  if (total <= 0) throw new Error('Сумма весов должна быть положительной');

  return Object.freeze(
    Object.fromEntries(keys.map((key) => [key, Math.max(0, merged[key]) / total])) as Record<keyof MatchFactors, number>,
  );
}

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
