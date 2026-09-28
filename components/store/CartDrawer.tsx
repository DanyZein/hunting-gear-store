"use client";

import { useStore } from "@/components/store/StoreProvider";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/icons";
import { Scrim } from "@/components/ui/Scrim";
import { ProductArt } from "@/lib/art";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import type { Settings } from "@/lib/types";

/**
 * The cart.
 *
 * There is no checkout behind it and no database holding the lines — the cart
 * lives in this browser's localStorage. The button says so rather than
 * pretending to take a payment.
 */
export function CartDrawer({ settings }: { settings: Settings }) {
  const { lines, subtotal, drawer, closeDrawer, setQty, remove, toast } = useStore();
  const open = drawer === "cart";

  const threshold = settings.freeFreightThreshold;
  const freight =
    subtotal >= threshold || subtotal === 0
      ? settings.freightNote
      : `Add ${money(threshold - subtotal)} for free freight.`;

  return (
    <>
      <Scrim open={open} onClick={closeDrawer} />

      <aside
        inert={!open}
        aria-label="Cart"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-100 flex w-[min(410px,100vw)] flex-col",
          "border-l border-line bg-ground text-fg",
          "transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)]",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        <div className="pad-safe-t flex flex-none items-center justify-between gap-3.5 border-b border-line px-[var(--gut)] py-4.5">
          <b className="font-display text-[1.22rem] font-bold tracking-[0.09em] uppercase">
            Your kit
          </b>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="grid size-8.5 place-items-center rounded-[3px] text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <CloseIcon className="size-[17px]" />
          </button>
        </div>

        <div className="pad-safe-b flex-1 overflow-y-auto px-[var(--gut)] py-4.5">
          {lines.length === 0 ? (
            <p className="px-2.5 py-14 text-center font-mono text-[0.76rem] leading-loose tracking-[0.08em] text-fg-3">
              Your cart is empty.
              <br />
              Start with a layering kit.
            </p>
          ) : (
            lines.map((line) => (
              <div
                key={line.id}
                className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-3.5 border-b border-line py-3.5"
              >
                <div className="grid size-14 place-items-center rounded-[3px] bg-surface-2 text-fg-2">
                  <ProductArt art={line.art} className="size-[64%]" />
                </div>

                <div className="min-w-0">
                  <p className="font-display text-base font-semibold leading-tight tracking-[0.03em] uppercase">
                    {line.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.6rem] tracking-[0.1em] uppercase text-fg-3">
                    {line.category}
                  </p>

                  <span className="mt-2 inline-flex items-center overflow-hidden rounded-[3px] border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(line.id, line.qty - 1)}
                      aria-label={`Decrease quantity of ${line.name}`}
                      className="grid size-[26px] place-items-center text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      −
                    </button>
                    <span className="min-w-7 text-center font-mono text-[0.76rem] tabular-nums">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(line.id, line.qty + 1)}
                      aria-label={`Increase quantity of ${line.name}`}
                      className="grid size-[26px] place-items-center text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      +
                    </button>
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[0.84rem] tabular-nums">
                    {money(line.price * line.qty)}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    className="mt-2 block font-mono text-[0.58rem] tracking-[0.1em] uppercase text-fg-3 transition-colors hover:text-blaze-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pad-safe-b flex-none border-t border-line bg-surface px-[var(--gut)] py-4.5">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-mono text-[0.66rem] tracking-[0.14em] uppercase text-fg-3">
              Subtotal
            </span>
            <b className="font-display text-[1.9rem] font-bold leading-none tabular-nums">
              {money(subtotal)}
            </b>
          </div>
          <p className="mb-3.5 font-mono text-[0.62rem] tracking-[0.06em] text-fg-3">{freight}</p>
          <Button
            type="button"
            variant="blaze"
            className="w-full"
            onClick={() =>
              toast(
                lines.length === 0
                  ? "Nothing in the cart yet."
                  : "Checkout is not connected yet — no payment provider is wired up.",
              )
            }
          >
            Checkout
          </Button>
        </div>
      </aside>
    </>
  );
}
