/**
 * Join class names, dropping falsy entries.
 *
 * Deliberately not `clsx` + `tailwind-merge`. Merging would silently resolve
 * conflicting utilities, which hides a real bug: two utilities setting the same
 * property have an unpredictable winner in Tailwind because they carry equal
 * specificity. The fix is to pick one via a variant prop, not to merge. Components
 * here take `variant` / `tone` props instead of colour overrides for that reason.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
