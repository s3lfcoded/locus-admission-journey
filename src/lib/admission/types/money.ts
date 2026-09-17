import { z } from 'zod';

/** Валюты региона: тенге, доллар, рубль, евро, сом, сум. */
export const CURRENCIES = ['KZT', 'USD', 'RUB', 'EUR', 'KGS', 'UZS'] as const;
export const currencySchema = z.enum(CURRENCIES);
export type Currency = z.infer<typeof currencySchema>;

export const moneySchema = z.object({
  amount: z.number().min(0),
  currency: currencySchema,
});
export type Money = z.infer<typeof moneySchema>;

export const CURRENCY_SYMBOLS: Readonly<Record<Currency, string>> = {
  KZT: '₸',
  USD: '$',
  RUB: '₽',
  EUR: '€',
  KGS: 'с',
  UZS: 'сўм',
};

/**
 * Курсы к доллару: сколько единиц валюты за 1 USD.
 *
 * ВНИМАНИЕ: это ориентировочные значения, зашитые как запасной вариант.
 * Курс меняется ежедневно, и стоимость обучения, пересчитанная по устаревшему
 * курсу, вводит абитуриента в заблуждение. В продакшене сюда нужно подавать
 * живые курсы — функции сравнения принимают их параметром именно поэтому.
 */
export interface FxRates {
  /** Дата, на которую актуальны курсы. */
  readonly asOf: string;
  readonly perUsd: Readonly<Record<Currency, number>>;
}

export const FALLBACK_FX: FxRates = {
  asOf: '2026-09-01',
  perUsd: { USD: 1, KZT: 525, RUB: 92, EUR: 0.92, KGS: 87, UZS: 12800 },
};

/** Приводит сумму к доллару — единственная общая точка отсчёта для сравнения. */
export function toUsd(money: Money, fx: FxRates = FALLBACK_FX): number {
  const rate = fx.perUsd[money.currency];
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Нет курса для валюты ${money.currency} на ${fx.asOf}`);
  }
  return money.amount / rate;
}

/** Перевод между любыми двумя валютами через доллар. */
export function convert(money: Money, to: Currency, fx: FxRates = FALLBACK_FX): Money {
  if (money.currency === to) return money;
  const rate = fx.perUsd[to];
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Нет курса для валюты ${to} на ${fx.asOf}`);
  }
  return { amount: toUsd(money, fx) * rate, currency: to };
}

const FORMATTERS = new Map<string, Intl.NumberFormat>();

/** Форматирует сумму под локаль: «3 000 000 ₸», «$15,000». */
export function formatMoney(money: Money, locale = 'ru-KZ'): string {
  const key = `${locale}:${money.currency}`;
  let formatter = FORMATTERS.get(key);
  if (formatter === undefined) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: 0,
    });
    FORMATTERS.set(key, formatter);
  }
  return formatter.format(money.amount);
}
