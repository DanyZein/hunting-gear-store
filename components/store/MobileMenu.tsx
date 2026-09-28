"use client";

import Link from "next/link";

import { useFilters } from "@/components/store/FilterProvider";
import { useStore } from "@/components/store/StoreProvider";
import { CloseIcon } from "@/components/ui/icons";
import { Scrim } from "@/components/ui/Scrim";
import { cn } from "@/lib/cn";
import type { Settings } from "@/lib/types";

/**
 * The below-lg menu. It carries the same ground filters as the picker on the
 * home page, because the ground is the first thing a hunter narrows by and
 * burying it in a menu on a phone would be backwards.
 */
export function MobileMenu({ settings }: { settings: Settings }) {
  const { drawer, closeDrawer } = useStore();
  const { grounds, setGround, setGroup } = useFilters();
  const open = drawer === "menu";

  return (
    <>
      <Scrim open={open} onClick={closeDrawer} />

      <aside
        inert={!open}
        aria-label="Menu"
        className={cn(
          "fixed top-0 bottom-0 left-0 z-100 flex w-[min(340px,100vw)] flex-col",
          "border-r border-line bg-ground text-fg",
          "transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)]",
          open ? "translate-x-0" : "pointer-events-none -translate-x-full",
        )}
      >
        <div className="pad-safe-t flex flex-none items-center justify-between gap-3.5 border-b border-line px-[var(--gut)] py-4.5">
          <b className="font-display text-[1.22rem] font-bold tracking-[0.09em] uppercase">Menu</b>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            className="grid size-8.5 place-items-center rounded-[3px] text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <CloseIcon className="size-[17px]" />
          </button>
        </div>

        <div className="pad-safe-b flex-1 overflow-y-auto px-[var(--gut)] py-4.5">
          <nav aria-label="Mobile">
            {settings.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeDrawer}
                className="flex items-center justify-between border-b border-line py-[0.55em] font-display text-[1.4rem] font-semibold tracking-[0.07em] uppercase"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="mt-6 mb-2.5 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-fg-3">
            Ground
          </p>
          <div className="flex flex-col gap-0.5">
            {grounds
              .filter((ground) => ground.id !== "all")
              .map((ground) => (
                <Link
                  key={ground.id}
                  href="/#catalog"
                  onClick={() => {
                    setGround(ground.id);
                    setGroup("all");
                    closeDrawer();
                  }}
                  className="py-1.5 text-[0.95rem] text-fg-2 transition-colors hover:text-fg"
                >
                  {ground.name}
                </Link>
              ))}
          </div>

          <p className="mt-6 mb-2.5 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-fg-3">
            Help
          </p>
          <div className="flex flex-col gap-0.5">
            <Link href="/#system" onClick={closeDrawer} className="py-1.5 text-[0.95rem] text-fg-2 hover:text-fg">
              Sizing &amp; layering
            </Link>
            <Link href="/#lighting" onClick={closeDrawer} className="py-1.5 text-[0.95rem] text-fg-2 hover:text-fg">
              Beam guide
            </Link>
            <Link href="/#notes" onClick={closeDrawer} className="py-1.5 text-[0.95rem] text-fg-2 hover:text-fg">
              Repairs
            </Link>
            <Link href="/#notes" onClick={closeDrawer} className="py-1.5 text-[0.95rem] text-fg-2 hover:text-fg">
              Shipping &amp; returns
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
