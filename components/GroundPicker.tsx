"use client";

import { matchesFilters, useFilters } from "@/components/store/FilterProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import type { Pages, Product } from "@/lib/types";

/**
 * Where are you hunting — the coarse filter at the top of /shop.
 *
 * Sits directly above the grid on the same route, so picking a ground
 * re-filters the products below it. That live handoff is the whole reason this
 * stayed on the same page as Catalog when the site split into routes.
 */
export function GroundPicker({
  content,
  products,
  headingLevel = "h2",
}: {
  content: Pages["shop"]["grounds"];
  products: Product[];
  /** Stays `h2`: "Where are you hunting?" is a question, not a page title. */
  headingLevel?: "h1" | "h2";
}) {
  const { ground, grounds, setGround, setGroup, query, group } = useFilters();

  const matches = products.filter((product) =>
    matchesFilters(product, { ground, group, query }),
  ).length;

  return (
    // pb-0: this now sits directly above the grid it filters rather than
    // mid-scroll, so the two should read as one block. The catalog below brings
    // its own top padding.
    <section className="pt-[clamp(52px,7vw,100px)] pb-0">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <SectionHeading level={headingLevel} className="mt-2.5 max-w-[20ch] text-balance">
          {content.headline}
        </SectionHeading>
        <p className="mt-3.5 max-w-[56ch] text-[1.02rem] leading-[1.62] text-fg-2">{content.body}</p>

        <div
          className="mt-[22px] flex flex-wrap gap-2.5"
          role="group"
          aria-label="Filter by hunting ground"
        >
          {grounds.map((option) => {
            const pressed = ground === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => {
                  setGround(option.id);
                  setGroup("all");
                }}
                className={cn(
                  "flex items-center gap-2.5 rounded-[3px] border px-[1.2em] py-[0.8em] text-left transition-colors",
                  pressed
                    ? "border-fg bg-fg text-ground"
                    : "border-line bg-surface hover:border-moss-2",
                )}
              >
                <svg
                  viewBox="0 0 30 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-[22px] flex-none"
                >
                  <path d={option.icon} />
                </svg>
                <span>
                  <span className="block font-display text-[1.05rem] font-semibold leading-tight tracking-[0.06em] uppercase">
                    {option.name}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block font-mono text-[0.6rem] tracking-[0.06em]",
                      pressed ? "text-ground/70" : "text-fg-3",
                    )}
                  >
                    {option.sub}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] tracking-[0.1em] uppercase text-fg-3">
          <span>
            {matches} {plural(matches, "piece")} match
          </span>
          <a href="#catalog" className="border-b border-blaze pb-0.5 text-fg transition-colors hover:text-blaze">
            See them
          </a>
        </p>
      </div>
    </section>
  );
}
