"use client";

import { matchesFilters, useFilters } from "@/components/store/FilterProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import type { HomeContent, Product } from "@/lib/types";

/**
 * Step one of the shop: where are you hunting.
 *
 * The catalog sits two sections below, so filtering here would be invisible
 * feedback on its own. The live match count and the jump link exist so picking
 * a ground does something you can see from where you are standing.
 */
export function GroundPicker({
  content,
  products,
}: {
  content: HomeContent["grounds"];
  products: Product[];
}) {
  const { ground, grounds, setGround, setGroup, query, group } = useFilters();

  const matches = products.filter((product) =>
    matchesFilters(product, { ground, group, query }),
  ).length;

  return (
    <section className="py-[clamp(52px,7vw,100px)]">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <h2 className="mt-2.5 max-w-[20ch] font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.96] tracking-[-0.014em] text-balance">
          {content.headline}
        </h2>
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
