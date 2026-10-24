export const MONTHLY_PRICE = 29;
export const FIRST_MONTH_PRICE = 14.5;

/** Preis für einen bestimmten Abo-Monat (1 = erster Monat). */
export function priceForMonth(month: number): number {
  return month === 1 ? FIRST_MONTH_PRICE : MONTHLY_PRICE;
}

export const formatEuro = (v: number) =>
  v.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
