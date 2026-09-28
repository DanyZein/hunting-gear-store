"use client";

import { useEffect, useState } from "react";

import type { Season } from "@/lib/types";

/**
 * Counts down to the next season opener.
 *
 * The target is computed on the client rather than the server, because the
 * server's clock and the visitor's clock disagree and a mismatch here is a
 * hydration error. Before mount both render "--", which is also what a reader
 * with JavaScript off sees.
 */

function nextOpener({ month, day, hour, minute }: Season): number {
  const now = new Date();
  const build = (year: number) =>
    new Date(year, month - 1, day, hour, minute, 0, 0).getTime();

  const thisYear = build(now.getFullYear());
  return thisYear > now.getTime() ? thisYear : build(now.getFullYear() + 1);
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function split(ms: number): Remaining {
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function useCountdown(season: Season): Remaining | null {
  const { month, day, hour, minute } = season;
  const [left, setLeft] = useState<Remaining | null>(null);

  useEffect(() => {
    const target = nextOpener({ month, day, hour, minute } as Season);
    const tick = () => setLeft(split(Math.max(0, target - Date.now())));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [month, day, hour, minute]);

  return left;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** One compact line for the announcement bar. */
export function CountdownLine({ season }: { season: Season }) {
  const left = useCountdown(season);
  return (
    <b className="font-medium text-blaze">
      {left ? `${left.days}d ${pad(left.hours)}h ${pad(left.minutes)}m` : "--"}
    </b>
  );
}

/** The four-cell readout in the hero card. */
export function CountdownCells({ season }: { season: Season }) {
  const left = useCountdown(season);
  const cells: Array<[string, number | null]> = [
    ["Days", left?.days ?? null],
    ["Hrs", left?.hours ?? null],
    ["Min", left?.minutes ?? null],
    ["Sec", left?.seconds ?? null],
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {cells.map(([label, value], index) => (
        <div
          key={label}
          className={index === 0 ? "" : "border-l border-chrome-line pl-2.5"}
        >
          <b className="block font-display text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold leading-none tabular-nums text-chrome-fg">
            {value === null ? "--" : pad(value)}
          </b>
          <em className="mt-1.5 block font-mono text-[0.56rem] tracking-[0.16em] uppercase not-italic text-chrome-fg-2">
            {label}
          </em>
        </div>
      ))}
    </div>
  );
}
