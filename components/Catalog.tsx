"use client";

import { ProductCard } from "@/components/ProductCard";
import { matchesFilters, useFilters } from "@/components/store/FilterProvider";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { plural } from "@/lib/format";
import type { HomeContent, Product } from "@/lib/types";

/**
 * Step three: the grid.
 *
 * Filtering happens in the browser over the full list. With twelve products
 * that is instant and needs no round trip. When the catalog grows past a few
 * hundred, this is the component that starts filtering server-side — the
 * content seam does not change either way.
 */
export function Catalog({
  products,
  content,
}: {
  products: Product[];
  content: HomeContent["catalog"];
}) {
  const { ground, group, query, groups, setGroup, clear } = useFilters();

  const visible = products.filter((product) =>
    matchesFilters(product, { ground, group, query }),
  );

  const filtered = ground !== "all" || group !== "all" || query.trim() !== "";

  return (
    <section id="catalog" className="py-[clamp(52px,7vw,100px)]">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h2 className="mt-2.5 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.96] tracking-[-0.014em]">
              {content.headline}
            </h2>
          </div>
          <p className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-fg-3 tabular-nums">
            {visible.length} of {products.length} {plural(products.length, "piece")}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <span className="w-[76px] flex-none font-mono text-[0.6rem] tracking-[0.18em] uppercase text-fg-3 max-[720px]:w-auto">
            Category
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {groups.map((option) => (
              <Chip
                key={option.id}
                pressed={group === option.id}
                onClick={() => setGroup(option.id)}
              >
                {option.name}
              </Chip>
            ))}
          </div>

          {filtered && (
            <button
              type="button"
              onClick={clear}
              className="ml-1 font-mono text-[0.64rem] tracking-[0.1em] uppercase text-blaze-2 underline underline-offset-4"
            >
              Clear
            </button>
          )}
        </div>

        {query.trim() !== "" && (
          <p className="mt-3 font-mono text-[0.68rem] tracking-[0.08em] text-fg-3">
            Searching “{query.trim()}”
          </p>
        )}

        {visible.length === 0 ? (
          <p className="py-14 text-center font-mono text-[0.8rem] tracking-[0.08em] text-fg-3">
            Nothing matches those filters. Try a different ground.
          </p>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-[clamp(14px,1.8vw,22px)] min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
