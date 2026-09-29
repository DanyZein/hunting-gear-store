"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useFilters } from "@/components/store/FilterProvider";
import { useStore } from "@/components/store/StoreProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BurgerIcon, CaretIcon, CartIcon, CloseIcon, SearchIcon } from "@/components/ui/icons";
import { BrandMark } from "@/lib/art";
import { cn } from "@/lib/cn";
import type { Settings } from "@/lib/types";

const stickyTop = "top-[env(safe-area-inset-top,0px)]";

// 36px below 360px. The wordmark is `flex-none`, so at 320px the row runs out
// of room and has to give somewhere; 360px is the narrowest width where the
// full-size controls still fit, and it is a far more common screen than 320.
const iconButton =
  "relative grid size-9 min-[360px]:size-10 place-items-center rounded-[3px] text-chrome-fg transition-colors hover:bg-spruce-2";

export function Header({ settings }: { settings: Settings }) {
  const { count, openDrawer } = useStore();
  const { query, setQuery, commitQuery } = useFilters();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function toggleSearch() {
    const next = !searchOpen;
    setSearchOpen(next);
    if (!next) setQuery("");
  }

  return (
    <header
      className={cn(
        stickyTop,
        "sticky z-60 border-b border-chrome-line bg-chrome text-chrome-fg",
      )}
    >
      <div className="mx-auto flex min-h-[66px] w-full max-w-[1300px] items-center gap-3 px-[var(--gut)] min-[360px]:gap-6 lg:gap-8">
        <Link href="/" className="flex flex-none items-center gap-2.5" aria-label={`${settings.brand.name}, home`}>
          <BrandMark className="size-6.5 text-blaze" />
          <span>
            <b className="block font-display text-[1.42rem] font-bold leading-none tracking-[0.13em] uppercase">
              {settings.brand.name}
            </b>
            <small className="mt-0.5 block font-mono text-[0.5rem] tracking-[0.3em] uppercase text-chrome-fg-2 max-[460px]:hidden">
              {settings.brand.sub}
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {settings.nav.map((item) =>
            item.columns ? (
              <div key={item.label} className="group relative flex items-center">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 border-b-2 border-transparent py-[0.7em] font-display text-base font-semibold tracking-[0.09em] uppercase transition-colors hover:border-blaze"
                >
                  {item.label}
                  <CaretIcon className="w-2 opacity-60" />
                </Link>

                <div
                  className={cn(
                    "invisible absolute top-full left-[-18px] z-70 grid translate-y-2 grid-cols-3 gap-6",
                    "min-w-[min(600px,calc(100vw-40px))] border border-chrome-line bg-chrome-2 p-6 opacity-0",
                    "shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] transition-[opacity,transform,visibility] duration-200",
                    "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                    "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
                  )}
                >
                  {item.columns.map((column) => (
                    <div key={column.title}>
                      <p className="mb-2.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-blaze">
                        {column.title}
                      </p>
                      {/* No onClick setting the group. The href already carries
                          ?group= and the provider reads the URL, so a second
                          writer here would fight the URL and only work for
                          plain left-clicks. */}
                      {column.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="block py-1 text-[0.94rem] text-chrome-fg-2 transition-colors hover:text-chrome-fg"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="border-b-2 border-transparent py-[0.7em] font-display text-base font-semibold tracking-[0.09em] uppercase transition-colors hover:border-blaze"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Dropped under 360px to buy the row 46px. Least costly thing to
              lose: the site already follows `prefers-color-scheme` when no
              explicit choice is stored, so a small-screen visitor still gets
              their system theme, just not the override. */}
          <ThemeToggle className="max-[360px]:hidden" />

          <button
            type="button"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-label="Search the catalog"
            className={iconButton}
          >
            <SearchIcon className="size-[19px]" />
          </button>

          <button
            type="button"
            onClick={() => openDrawer("cart")}
            aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
            className={iconButton}
          >
            <CartIcon className="size-[19px]" />
            {count > 0 && (
              <span className="absolute top-1 right-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-blaze px-1 font-mono text-[0.6rem] font-bold leading-none text-[#12160f] tabular-nums">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => openDrawer("menu")}
            aria-label="Open menu"
            className={cn(iconButton, "lg:hidden")}
          >
            <BurgerIcon className="size-[19px]" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-chrome-line bg-chrome">
          {/* A real form, not a div. Before the site had routes this called
              getElementById("catalog").scrollIntoView(), which silently did
              nothing on any page that was not the one holding the catalog.
              A GET form works without JavaScript and puts the query in the URL,
              so a result is shareable. */}
          <form
            action="/shop/"
            method="get"
            onSubmit={(event) => {
              // On /shop the grid has already been filtering as you typed, so
              // letting the GET run would reload the page to show the same
              // result. Commit the query to the address bar instead, which is
              // what makes the search shareable. Anywhere else there is no grid
              // to update, so fall through and let the form navigate.
              if (pathname !== "/shop/") return;
              event.preventDefault();
              commitQuery();
            }}
            className="mx-auto flex w-full max-w-[1300px] items-center gap-3 px-[var(--gut)] py-3.5"
          >
            <SearchIcon className="size-[18px] flex-none text-chrome-fg-2" />
            <input
              ref={inputRef}
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") toggleSearch();
              }}
              placeholder="Search jackets, boots, lumens…"
              aria-label="Search the catalog"
              autoComplete="off"
              className="flex-1 bg-transparent py-1 text-[1.05rem] text-chrome-fg outline-none placeholder:text-chrome-fg-2"
            />
            <button type="button" onClick={toggleSearch} aria-label="Close search" className={iconButton}>
              <CloseIcon className="size-[17px]" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
