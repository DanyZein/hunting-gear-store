"use client";

import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { THEME_KEY } from "@/lib/theme";

type Theme = "light" | "dark";

/**
 * Light/dark switch.
 *
 * Browsing a gear catalog at 5 a.m. in a truck is a real thing hunters do, so
 * an explicit choice matters here rather than just following the OS.
 *
 * The attribute is applied by the inline script in `layout.tsx` before first
 * paint; this component only reads what that script decided and writes changes
 * back. Until the effect runs it renders the light-mode icon, so the server
 * output and the first client render agree.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (applied === "light" || applied === "dark") {
      setTheme(applied);
      return;
    }
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = (theme ?? "light") === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private window. The choice just will not survive a reload.
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative grid size-10 place-items-center rounded-[3px] text-chrome-fg transition-colors hover:bg-spruce-2",
        className,
      )}
    >
      {isDark ? <SunIcon className="size-[19px]" /> : <MoonIcon className="size-[19px]" />}
    </button>
  );
}
