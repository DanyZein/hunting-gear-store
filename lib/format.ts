/** Whole-dollar formatting. Prices in this catalog never carry cents. */
export function money(amount: number): string {
  return "$" + amount.toLocaleString("en-US");
}

/** "2 lb 4 oz" style values are authored in content, not derived here. */
export function plural(count: number, one: string, many = one + "s"): string {
  return count === 1 ? one : many;
}

/** Kit pricing: 10% off the sum of the three pieces, rounded to a whole dollar. */
export const KIT_DISCOUNT = 0.9;

export function kitPrice(sum: number): number {
  return Math.round(sum * KIT_DISCOUNT);
}
