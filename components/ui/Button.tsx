import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * `blaze` is the one loud element on any screen. Everything else is quiet on
 * purpose, because the accent only works when it is rare.
 */
export type ButtonVariant = "blaze" | "ghost" | "solid" | "line";
export type ButtonSize = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-[0.55em] font-display font-semibold uppercase " +
  "tracking-[0.06em] rounded-[3px] border border-transparent transition-colors whitespace-nowrap " +
  "disabled:opacity-45 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  blaze: "bg-blaze text-[#12160f] border-blaze hover:bg-[#ff7d38] hover:border-[#ff7d38]",
  ghost: "border-moss-2 text-chrome-fg hover:bg-spruce-2 hover:border-chrome-fg-2",
  solid: "bg-fg text-ground hover:bg-moss-2 hover:text-white",
  line: "border-line text-fg hover:border-moss-2 hover:bg-surface-2",
};

const sizes: Record<ButtonSize, string> = {
  md: "text-[1.02rem] px-[1.5em] py-[0.72em]",
  sm: "text-[0.9rem] px-[1em] py-[0.5em]",
};

interface Common {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "blaze",
  size = "md",
  className,
  children,
  ...rest
}: Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "blaze",
  size = "md",
  className,
  children,
}: Common & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
