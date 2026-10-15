"use client";

import { useMemo, useState } from "react";

import { useStore } from "@/components/store/StoreProvider";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductArt } from "@/lib/art";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import type { Layer, LayerKey, Pages, Product } from "@/lib/types";

/**
 * The layering system.
 *
 * Hunters buy a system, not a jacket. Pick outer, mid, and footwear for the
 * base kit at 10% off. Add lighting or gear and each adds 2% more discount.
 */
export function KitBuilder({
  products,
  layers,
  content,
  headingLevel = "h2",
}: {
  products: Product[];
  layers: Layer[];
  content: Pages["layering"]["system"];
  headingLevel?: "h1" | "h2";
}) {
  const { addMany } = useStore();

  const optionsByLayer = useMemo(() => {
    const map = {} as Record<LayerKey, Product[]>;
    for (const layer of layers) {
      map[layer.key] = products.filter((product) => product.layer === layer.key);
    }
    return map;
  }, [products, layers]);

  // Base kit layers (required for discount)
  const baseKitLayers = ["outer", "mid", "footwear"] as const;
  // Addition layers (optional, add 2% each)
  const additionLayers = ["lighting", "gear"] as const;

  const [selection, setSelection] = useState<Partial<Record<LayerKey, string>>>(
    () => {
      const initial: Partial<Record<LayerKey, string>> = {};
      // Only pre-select base kit layers
      for (const key of baseKitLayers) {
        initial[key] = products.find((product) => product.layer === key)?.id;
      }
      // Don't pre-select additions
      return initial;
    }
  );

  const chosen = layers
    .map((layer) => optionsByLayer[layer.key]?.find((p) => p.id === selection[layer.key]))
    .filter((p): p is Product => Boolean(p));

  const sum = chosen.reduce((total, product) => total + product.price, 0);

  // Calculate discount
  const hasOuter = chosen.some((p) => p.layer === "outer");
  const hasMid = chosen.some((p) => p.layer === "mid");
  const hasFootwear = chosen.some((p) => p.layer === "footwear");
  const hasLaser = chosen.some((p) => p.layer === "gear");
  const hasFlashlight = chosen.some((p) => p.layer === "lighting");

  const baseKitComplete = hasOuter && hasMid && hasFootwear;
  const extraDiscount = (hasLaser ? 0.02 : 0) + (hasFlashlight ? 0.02 : 0);
  const totalDiscount = baseKitComplete ? 0.10 + extraDiscount : 0;
  const price = Math.round(sum * (1 - totalDiscount));
  const saving = sum - price;

  // Complete when base kit is selected
  const complete = baseKitComplete;

  // Toggle selection (click to select, click again to deselect)
  const toggleSelection = (layerKey: LayerKey, productId: string) => {
    setSelection((current) => {
      const isSelected = current[layerKey] === productId;
      const next = { ...current };
      if (isSelected) {
        delete next[layerKey];
      } else {
        next[layerKey] = productId;
      }
      return next;
    });
  };

  return (
    <section
      id="system"
      className="border-y border-line bg-surface-2 py-[clamp(40px,5vw,72px)]"
    >
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <SectionHeading level={headingLevel} className="mt-2">
          {content.headline}
        </SectionHeading>
        <p className="mt-2.5 max-w-[56ch] text-[0.94rem] leading-[1.55] text-fg-2">
          {content.body}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)] lg:gap-10">
          <div className="space-y-4">
            {/* Base Kit Section */}
            <div>
              <h3 className="font-display text-[1rem] font-bold tracking-[0.08em] uppercase text-fg-3 mb-3">
                Base Kit <span className="font-mono text-[0.6rem] text-blaze ml-2">10% off</span>
              </h3>
              <p className="text-[0.76rem] text-fg-3 mb-3">
                Pick one from each row. All three required for kit pricing.
              </p>
              {baseKitLayers.map((key) => {
                const layer = layers.find((l) => l.key === key);
                if (!layer) return null;
                const options = optionsByLayer[key] ?? [];
                return (
                  <div key={key} className="mb-4 last:mb-0">
                    <div className="mb-2 flex items-center gap-2">
                      <b className="font-display text-[0.94rem] font-bold tracking-[0.08em] uppercase">
                        {layer.name}
                      </b>
                      <span className="font-mono text-[0.56rem] tracking-[0.1em] text-fg-3">
                        {layer.note}
                      </span>
                    </div>
                    <div
                      className="grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
                      role="group"
                      aria-label={`${layer.name} layer`}
                    >
                      {options.map((product) => {
                        const selected = selection[key] === product.id;
                        return (
                          <button
                            key={product.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleSelection(key, product.id)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-[3px] border p-2.5 text-left transition-[border-color,box-shadow]",
                              selected
                                ? "border-blaze bg-surface shadow-[inset_0_0_0_1px_var(--color-blaze)]"
                                : "border-line bg-surface hover:border-moss-2",
                            )}
                          >
                            <ProductArt
                              art={product.art}
                              className={cn("size-9 flex-none", selected ? "text-fg" : "text-fg-2")}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-display text-[0.9rem] font-semibold leading-[1.15] tracking-[0.03em] uppercase">
                                {product.name}
                              </span>
                              <span className="mt-0.5 block font-mono text-[0.6rem] text-fg-3">
                                {product.category}
                              </span>
                            </span>
                            <span className="flex-none font-mono text-[0.76rem] tabular-nums">
                              {money(product.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additions Section */}
            <div className="border-t border-line pt-4">
              <h3 className="font-display text-[1rem] font-bold tracking-[0.08em] uppercase text-fg-3 mb-3 flex items-center gap-2">
                Additions
                <span className="font-mono text-[0.56rem] text-blaze px-1.5 py-0.5 rounded-xs">
                  +2% each
                </span>
              </h3>
              <p className="text-[0.76rem] text-fg-3 mb-3">
                Optional. Each adds 2% more discount to the kit.
              </p>
              {additionLayers.map((key) => {
                const layer = layers.find((l) => l.key === key);
                if (!layer) return null;
                const options = optionsByLayer[key] ?? [];
                return (
                  <div key={key} className="mb-4 last:mb-0">
                    <div className="mb-2 flex items-center gap-2">
                      <b className="font-display text-[0.94rem] font-bold tracking-[0.08em] uppercase">
                        {layer.name}
                      </b>
                      <span className="font-mono text-[0.56rem] tracking-[0.1em] text-fg-3">
                        {layer.note}
                      </span>
                    </div>
                    <div
                      className="grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
                      role="group"
                      aria-label={`${layer.name} layer`}
                    >
                      {options.map((product) => {
                        const selected = selection[key] === product.id;
                        return (
                          <button
                            key={product.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleSelection(key, product.id)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-[3px] border p-2.5 text-left transition-[border-color,box-shadow] relative",
                              selected
                                ? "border-blaze bg-surface shadow-[inset_0_0_0_1px_var(--color-blaze)]"
                                : "border-line bg-surface hover:border-moss-2",
                            )}
                          >
                            {/* Plus/Minus indicator */}
                            <span
                              className={cn(
                                "flex-none size-5 flex items-center justify-center rounded border font-mono text-[0.62rem] leading-none transition-colors",
                                selected
                                  ? "border-blaze text-blaze bg-[rgba(239,106,36,0.1)]"
                                  : "border-line text-fg-3 hover:border-blaze hover:text-blaze",
                              )}
                            >
                              {selected ? "−" : "+"}
                            </span>
                            <ProductArt
                              art={product.art}
                              className={cn("size-9 flex-none", selected ? "text-fg" : "text-fg-2")}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-display text-[0.9rem] font-semibold leading-[1.15] tracking-[0.03em] uppercase">
                                {product.name}
                              </span>
                              <span className="mt-0.5 block font-mono text-[0.6rem] text-fg-3">
                                {product.category}
                              </span>
                            </span>
                            <span className="flex-none font-mono text-[0.76rem] tabular-nums">
                              {money(product.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Panel */}
          <div className="rounded-[3px] bg-ink p-5 text-chrome-fg lg:sticky lg:top-[80px] lg:self-start space-y-4">
            <h2 className="font-display text-[1.15rem] font-bold tracking-[0.07em] uppercase">
              Your kit
            </h2>

            {/* Base kit items */}
            <div className="space-y-2 border-b border-dashed border-chrome-line pb-3">
              {baseKitLayers.map((key) => {
                const layer = layers.find((l) => l.key === key);
                if (!layer) return null;
                const product = chosen.find((p) => p.layer === key);
                return (
                  <div
                    key={key}
                    className="flex justify-between gap-2.5 text-[0.82rem]"
                  >
                    <span className={cn("min-w-0", product ? "text-chrome-fg-2" : "text-[#6b7364]")}>
                      {layer.name}: {product ? product.name : "not picked"}
                    </span>
                    <span className="flex-none text-right font-mono tabular-nums">
                      {product ? money(product.price) : "-"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Addition items - only show if selected */}
            {additionLayers.map((key) => {
              const layer = layers.find((l) => l.key === key);
              if (!layer) return null;
              const product = chosen.find((p) => p.layer === key);
              if (!product) return null;
              return (
                <div
                  key={key}
                  className="flex justify-between gap-2.5 text-[0.82rem] text-[#6b7364]"
                >
                  <span>{layer.name}: {product.name}</span>
                  <span className="flex-none text-right font-mono tabular-nums">
                    {money(product.price)}
                  </span>
                </div>
              );
            })}

            {/* Price breakdown */}
            <div className="space-y-2 border-t border-dashed border-chrome-line pt-3">
              <div className="flex justify-between text-[0.76rem] text-chrome-fg-2">
                <span>Subtotal</span>
                <span className="font-mono">{money(sum)}</span>
              </div>
              {baseKitComplete && (
                <div className="flex justify-between text-[0.76rem] text-blaze">
                  <span>Kit discount ({Math.round(totalDiscount * 100)}%)</span>
                  <span className="font-mono">−{money(saving)}</span>
                </div>
              )}
              {!baseKitComplete && chosen.length > 0 && (
                <div className="flex justify-between text-[0.76rem] text-chrome-fg-3">
                  <span>Complete the base kit for 10% off</span>
                </div>
              )}

              <div className="flex items-baseline justify-between border-t border-chrome-line pt-3">
                <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-chrome-fg-2">
                  Kit price
                </span>
                <b className="font-display text-[2rem] font-bold leading-none tabular-nums">
                  {money(price)}
                </b>
              </div>
            </div>

            {saving > 0 && (
              <div className="rounded-r-[2px] border-l-2 border-blaze bg-[rgba(239,106,36,0.12)] px-3 py-2 font-mono text-[0.66rem] tracking-[0.06em] flex justify-between">
                <span>Buying as a kit saves</span>
                <b className="font-medium text-blaze">{money(saving)}</b>
              </div>
            )}

            <Button
              type="button"
              variant="blaze"
              disabled={!complete}
              className="w-full"
              onClick={() =>
                addMany(
                  chosen,
                  `Kit added: ${chosen.length} pieces, ${money(price)} at kit pricing`
                )
              }
            >
              Add kit to cart
            </Button>

            <p className="text-center text-[0.7rem] text-chrome-fg-2">{content.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
