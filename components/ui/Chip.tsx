import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/**
 * A filter toggle. Pill-shaped against the square cards on purpose: tags and
 * filters read as pills, objects read as rectangles.
 */
export function Chip({
  pressed,
  className,
  children,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
  pressed: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "inline-flex items-center gap-[0.45em] font-mono text-[0.7rem] tracking-[0.09em] uppercase",
        "px-[1em] py-[0.5em] rounded-full border transition-colors",
        pressed
          ? "bg-fg border-fg text-ground"
          : "border-line text-fg-2 hover:border-moss-2 hover:text-fg",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
