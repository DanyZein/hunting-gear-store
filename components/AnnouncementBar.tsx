"use client";

import { useEffect, useState } from "react";

import { CountdownLine } from "@/components/Countdown";
import type { Settings } from "@/lib/types";

/**
 * The top bar. Rotates service messages on the left, counts down to the opener
 * on the right. The countdown is the thing worth looking at, so it never
 * rotates.
 */
export function AnnouncementBar({ settings }: { settings: Settings }) {
  const { announcements, season } = settings;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length < 2) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % announcements.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, [announcements.length]);

  return (
    <div className="border-b border-chrome-line bg-ink text-chrome-fg-2">
      <div className="mx-auto flex min-h-[38px] w-full max-w-[1300px] flex-wrap items-center justify-between gap-4 px-[var(--gut)] py-2 sm:py-0">
        <p className="hidden font-mono text-[0.68rem] tracking-[0.1em] uppercase text-chrome-fg sm:block">
          {announcements[index]}
        </p>
        <p className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.1em] uppercase">
          <i className="block size-1.5 shrink-0 animate-pulse-dot rounded-full bg-blaze" />
          {season.label} <CountdownLine season={season} />
        </p>
      </div>
    </div>
  );
}
