import { cn } from "@/lib/cn";

/**
 * The one section headline style.
 *
 * This string used to be copy-pasted into six section components with small
 * per-site variations (`mt-2.5`, a `max-w-[Nch]`, `text-balance`). Extracting it
 * means the display scale changes in one place.
 *
 * `level` exists because a section is sometimes a page. A section that owns a
 * route renders the page's only `<h1>`; a section embedded under another
 * heading stays an `<h2>`. It is a prop rather than context because exactly one
 * section per page should be the `<h1>` and which one is a content decision, not
 * something a provider can infer. Context would also require `createContext`,
 * forcing a `"use client"` boundary around components that render on the server
 * today (FieldNotes, Reports).
 *
 * Per-instance additions go through `className`. Those are layout utilities
 * (margins, max-width) that do not collide with anything in `base`, which
 * matters because `cn` does not merge conflicting utilities — see lib/cn.ts.
 */
const base =
  "font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.96] tracking-[-0.014em]";

export function SectionHeading({
  level = "h2",
  className,
  children,
}: {
  level?: "h1" | "h2";
  className?: string;
  children: React.ReactNode;
}) {
  const Heading = level;
  return <Heading className={cn(base, className)}>{children}</Heading>;
}
