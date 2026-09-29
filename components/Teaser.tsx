import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * One card on the landing page pointing at a section that now has its own route.
 *
 * The whole card is the link, so there is no arrow glyph tacked onto the text —
 * the border and the eyebrow changing colour on hover is the affordance. The
 * copy comes from `Pages["home"]["teasers"]` and is deliberately different from
 * the target page's headline, which is that page's `<h1>` and `<title>`.
 */
export function Teaser({
  eyebrow,
  teaser,
  href,
  className,
}: {
  eyebrow: string;
  teaser: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-[3px] border border-line bg-surface p-[22px]",
        "transition-[border-color,transform,box-shadow] duration-200",
        "hover:-translate-y-0.5 hover:border-moss-2",
        "hover:shadow-[0_1px_2px_rgba(12,16,12,0.05),0_12px_34px_-16px_rgba(12,16,12,0.28)]",
        className,
      )}
    >
      <span className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-fg-3 transition-colors group-hover:text-blaze-2">
        {eyebrow}
      </span>
      <span className="mt-3 text-[1.02rem] leading-[1.58] text-fg-2">{teaser}</span>
    </Link>
  );
}
