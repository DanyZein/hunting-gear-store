import Link from "next/link";

import { BrandMark } from "@/lib/art";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-chrome-line bg-ink text-chrome-fg-2">
      <div className="mx-auto grid w-full max-w-[1300px] gap-8 px-[var(--gut)] py-[clamp(40px,5vw,66px)] sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <BrandMark className="size-6.5 text-blaze" />
            <span>
              <b className="block font-display text-[1.42rem] font-bold leading-none tracking-[0.13em] uppercase text-chrome-fg">
                {settings.brand.name}
              </b>
              <small className="mt-0.5 block font-mono text-[0.5rem] tracking-[0.3em] uppercase">
                {settings.brand.sub}
              </small>
            </span>
          </div>

          <p className="mt-4 max-w-[34ch] text-[0.88rem] leading-relaxed">
            Cut and shipped from {settings.contact.address}. Questions about fit, layering or
            lumens, call the shop and ask for whoever is at the bench.
          </p>

          {/* Shown as selectable text rather than a tel: link. A tap on a phone
              link inside a web app does not reliably place a call. */}
          <p className="mt-3 font-mono text-[0.86rem] text-chrome-fg select-all">
            {settings.contact.phone}
          </p>
          <p className="font-mono text-[0.86rem] text-chrome-fg select-all">
            {settings.contact.email}
          </p>
        </div>

        {settings.footer.map((column) => (
          <div key={column.title}>
            <h4 className="mb-3.5 font-mono text-[0.6rem] font-medium tracking-[0.2em] uppercase text-chrome-fg">
              {column.title}
            </h4>
            {column.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-1 text-[0.88rem] transition-colors hover:text-chrome-fg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-[1300px] flex-wrap justify-between gap-3.5 border-t border-chrome-line px-[var(--gut)] py-4.5 font-mono text-[0.62rem] tracking-[0.1em] uppercase">
        <span>© {new Date().getFullYear()} {settings.brand.name} Field Supply</span>
        <span>Checkout and accounts are not connected yet</span>
      </div>
    </footer>
  );
}
