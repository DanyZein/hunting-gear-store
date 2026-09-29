"use client";

import Link from "next/link";

import { useStore } from "@/components/store/StoreProvider";
import { Button } from "@/components/ui/Button";
import { ProductArt } from "@/lib/art";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * A catalog card.
 *
 * The spec strip is the card's whole personality: three real measurements in
 * mono, same three cells on every card so a row reads as a comparison table
 * rather than a row of advertisements.
 */
export function ProductCard({
  product,
  headingLevel = "h3",
}: {
  product: Product;
  /**
   * `h2` when the grid sits directly under a page `<h1>` — without it the
   * outline jumps h1 → h3, which axe's heading-order rule flags. Defaults to
   * `h3` for a grid nested under its own section heading.
   */
  headingLevel?: "h2" | "h3";
}) {
  const { add } = useStore();
  const badgeIsBlaze = product.badge === "Field pick" || product.badge === "New";
  const Heading = headingLevel;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[3px] border border-line bg-surface transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-moss-2 hover:shadow-[0_1px_2px_rgba(12,16,12,0.05),0_12px_34px_-16px_rgba(12,16,12,0.28)]">
      <Link
        href={`/products/${product.id}`}
        className="relative grid aspect-square place-items-center overflow-hidden bg-surface-2 text-fg-2"
        aria-label={product.name}
      >
        <span className="topo-tile pointer-events-none absolute inset-0" aria-hidden="true" />

        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- swapped for next/image when photos land in Blob
          <img
            src={product.image}
            alt={product.name}
            className="relative z-1 size-full object-cover"
          />
        ) : (
          <ProductArt art={product.art} className="relative z-1 size-[64%]" />
        )}

        {product.badge && (
          <span
            className={cn(
              "absolute top-2.5 left-2.5 z-2 rounded-[2px] px-2 py-1 font-mono text-[0.56rem] font-medium tracking-[0.14em] uppercase",
              badgeIsBlaze ? "bg-blaze text-[#12160f]" : "bg-fg text-ground",
            )}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-3.5 pt-3.5 pb-3">
        <p className="font-mono text-[0.58rem] tracking-[0.16em] uppercase text-fg-3">
          {product.category}
        </p>
        <Heading className="mt-1.5 min-h-[2.24em] font-display text-[1.1rem] font-semibold leading-[1.12] tracking-[0.02em] uppercase">
          <Link href={`/products/${product.id}`} className="transition-colors hover:text-blaze">
            {product.name}
          </Link>
        </Heading>

        <div className="mt-auto flex items-baseline justify-between gap-2.5 pt-2.5">
          <span className="font-mono text-[1.02rem] font-medium tabular-nums">
            {money(product.price)}
          </span>
          <span className="text-right font-mono text-[0.58rem] tracking-[0.1em] uppercase text-fg-3">
            {product.grounds.join(" / ")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-line">
        {product.specs.map((spec) => (
          <div
            key={spec.k}
            className="min-w-0 border-r border-line px-2.5 py-[7px] last:border-r-0"
          >
            <span className="block font-mono text-[0.52rem] tracking-[0.1em] uppercase text-fg-3">
              {spec.k}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[0.72rem]">{spec.v}</span>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="line"
        onClick={() => add(product)}
        className="w-full rounded-none border-0 border-t border-line py-[0.68em] text-[1.02rem] hover:bg-surface-2"
      >
        Add to cart
      </Button>
    </article>
  );
}
