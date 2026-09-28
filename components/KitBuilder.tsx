"use client";

import { useMemo, useState } from "react";

import { useStore } from "@/components/store/StoreProvider";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductArt } from "@/lib/art";
import { cn } from "@/lib/cn";
import { kitPrice, money } from "@/lib/format";
import type { HomeContent, Layer, LayerKey, Product } from "@/lib/types";

/**
 * The layering system.
 *
 * This is the piece that makes the shop feel like a hunting shop instead of a
 * generic storefront: hunters buy a system, not a jacket. Pick one from each
 * row and the three are priced together at 10% off.
 */
export function KitBuilder({
  products,
  layers,
  content,
}: {
  products: Product[];
  layers: Layer[];
  content: HomeContent["system"];
}) {
  const { addMany } = useStore();

  const optionsByLayer = useMemo(() => {
    const map = {} as Record<LayerKey, Product[]>;
    for (const layer of layers) {
      map[layer.key] = products.filter((product) => product.layer === layer.key);
    }
    return map;
  }, [products, layers]);

  const [selection, setSelection] = useState<Partial<Record<LayerKey, string>>>(() => {
    const initial: Partial<Record<LayerKey, string>> = {};
    for (const layer of layers) {
      initial[layer.key] = products.find((product) => product.layer === layer.key)?.id;
    }
    return initial;
  });

  const chosen = layers
    .map((layer) => optionsByLayer[layer.key]?.find((p) => p.id === selection[layer.key]))
    .filter((p): p is Product => Boolean(p));

  const sum = chosen.reduce((total, product) => total + product.price, 0);
  const price = kitPrice(sum);
  const saving = sum - price;
  const complete = chosen.length === layers.length;

  return (
    <section id="system" className="border-y border-line bg-surface-2 py-[clamp(52px,7vw,100px)]">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <h2 className="mt-2.5 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.96] tracking-[-0.014em]">
          {content.headline}
        </h2>
        <p className="mt-3.5 max-w-[56ch] text-[1.02rem] leading-[1.62] text-fg-2">{content.body}</p>

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] lg:gap-14">
          <div>
            {layers.map((layer) => (
              <div key={layer.key} className="mt-6 border-t border-line pt-4 first:mt-0 first:border-t-0 first:pt-0">
                <div className="mb-3.5 flex items-baseline gap-3">
                  <b className="font-display text-[1.18rem] font-bold tracking-[0.08em] uppercase">
                    {layer.name}
                  </b>
                  <span className="font-mono text-[0.64rem] tracking-[0.1em] text-fg-3">
                    {layer.note}
                  </span>
                </div>

                <div
                  className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(210px,1fr))]"
                  role="group"
                  aria-label={`${layer.name} layer`}
                >
                  {(optionsByLayer[layer.key] ?? []).map((product) => {
                    const selected = selection[layer.key] === product.id;
                    return (
                      <button
                        key={product.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setSelection((current) => ({ ...current, [layer.key]: product.id }))
                        }
                        className={cn(
                          "flex items-center gap-3.5 rounded-[3px] border p-3 text-left transition-[border-color,box-shadow]",
                          selected
                            ? "border-blaze bg-surface shadow-[inset_0_0_0_1px_var(--color-blaze)]"
                            : "border-line bg-surface hover:border-moss-2",
                        )}
                      >
                        <ProductArt
                          art={product.art}
                          className={cn("size-11 flex-none", selected ? "text-fg" : "text-fg-2")}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[1.06rem] font-semibold leading-[1.12] tracking-[0.03em] uppercase">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block font-mono text-[0.66rem] text-fg-3">
                            {product.category}
                          </span>
                        </span>
                        <span className="flex-none font-mono text-[0.84rem] tabular-nums">
                          {money(product.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[3px] bg-ink p-6 text-chrome-fg lg:sticky lg:top-[84px] lg:self-start">
            <h3 className="mb-4.5 font-display text-[1.3rem] font-bold tracking-[0.07em] uppercase">
              Your kit
            </h3>

            {layers.map((layer) => {
              const product = chosen.find((p) => p.layer === layer.key);
              return (
                <div
                  key={layer.key}
                  className="flex justify-between gap-3.5 border-b border-dashed border-chrome-line py-2.5 text-[0.88rem]"
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

            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-mono text-[0.66rem] tracking-[0.14em] uppercase text-chrome-fg-2">
                Kit price
              </span>
              <b className="font-display text-[2.3rem] font-bold leading-none tabular-nums">
                {money(price)}
              </b>
            </div>

            {saving > 0 && (
              <div className="mt-2.5 flex justify-between rounded-r-[2px] border-l-2 border-blaze bg-[rgba(239,106,36,0.14)] px-3 py-2.5 font-mono text-[0.72rem] tracking-[0.06em]">
                <span>Buying as a kit saves</span>
                <b className="font-medium text-blaze">{money(saving)}</b>
              </div>
            )}

            <Button
              type="button"
              variant="blaze"
              disabled={!complete}
              className="mt-5 w-full"
              onClick={() =>
                addMany(chosen, `Kit added: ${layers.length} pieces, ${money(price)} at kit pricing`)
              }
            >
              Add kit to cart
            </Button>

            <p className="mt-3 text-center text-[0.76rem] text-chrome-fg-2">{content.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
