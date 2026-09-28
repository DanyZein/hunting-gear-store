"use client";

import { useState } from "react";

import { useStore } from "@/components/store/StoreProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { money } from "@/lib/format";
import type { HomeContent, Product } from "@/lib/types";

/**
 * The beam rig.
 *
 * The one interactive moment on the page, and it earns its place: the tradeoff
 * between output, reach and runtime is the thing hunters actually argue about,
 * and it is invisible in a spec table. Drag the dial and the treeline lights up
 * in order as the beam reaches it.
 *
 * The scene is a fixed drawing; only the beam geometry and the lit-tree opacity
 * are derived from the dial.
 */

const EMITTER = { x: 110, y: 230 };

/** Positions and scales of the fir silhouettes, left to right. */
const TREES = [
  { x: 430, scale: 0.55 },
  { x: 520, scale: 0.85 },
  { x: 600, scale: 1 },
  { x: 690, scale: 0.72 },
  { x: 775, scale: 0.92 },
  { x: 855, scale: 0.62 },
];

const TREE_PATH =
  "M0 -200 L20 -150 L10 -150 L34 -88 L18 -88 L46 -18 L46 0 L-46 0 L-46 -18 L-18 -88 L-34 -88 L-10 -150 L-20 -150 Z";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function LightingRig({
  content,
  product,
}: {
  content: HomeContent["lighting"];
  product: Product;
}) {
  const { add } = useStore();
  const [dial, setDial] = useState(100);
  const t = dial / 100;

  const { dial: range } = content;
  const lumens = Math.round(range.minLumens + t * (range.maxLumens - range.minLumens));
  const reach = Math.round(range.reachAtMinYd + t * (range.reachAtMaxYd - range.reachAtMinYd));
  const runtime = range.runtimeAtMinHr + t * (range.runtimeAtMaxHr - range.runtimeAtMinHr);

  const spread = 30 + t * 122;
  const coreSpread = spread * 0.42;

  const beamPoints = (half: number) =>
    `${EMITTER.x},${EMITTER.y} 900,${EMITTER.y - half} 900,${EMITTER.y + half}`;

  /* Each tree lights once the beam has reached far enough to touch it. */
  const litFor = (index: number) => clamp((t - index * 0.15) * 2.4, 0, 1) * 0.8;

  return (
    <section id="lighting" className="border-t border-chrome-line bg-ink py-[clamp(52px,7vw,100px)] text-chrome-fg">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <Eyebrow tone="chrome">{content.eyebrow}</Eyebrow>
        <h2 className="mt-2.5 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.96] tracking-[-0.014em]">
          {content.headline}
        </h2>
        <p className="mt-3.5 max-w-[56ch] text-[1.02rem] leading-[1.62] text-chrome-fg-2">
          {content.body}
        </p>

        <div className="mt-9 aspect-[900/380] w-full overflow-hidden rounded-[3px] border border-chrome-line bg-[#0e1410] max-[720px]:aspect-[16/9]">
          <svg
            viewBox="0 0 900 380"
            preserveAspectRatio="xMinYMid slice"
            className="size-full"
            role="img"
            aria-label={`A headlamp beam reaching across a treeline at ${lumens} lumens, ${reach} yards, ${runtime.toFixed(1)} hours of runtime.`}
          >
            <defs>
              <linearGradient id="beam-outer" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ffd08a" stopOpacity=".5" />
                <stop offset=".45" stopColor="#ffd08a" stopOpacity=".14" />
                <stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="beam-core" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff1d8" stopOpacity=".62" />
                <stop offset=".4" stopColor="#ffd08a" stopOpacity=".2" />
                <stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="emitter-glow">
                <stop offset="0" stopColor="#ffe9c6" stopOpacity=".95" />
                <stop offset="1" stopColor="#ffd08a" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="900" height="380" fill="#0e1410" />
            <rect y="150" width="900" height="182" fill="#101711" />

            <g fill="none" stroke="#ffffff" strokeOpacity=".05" strokeWidth="1.1" aria-hidden="true">
              <path d="M120 92 C142 24 226 -14 300 -2 C374 10 424 62 412 124 C400 186 326 226 252 214 C178 202 98 160 120 92 Z" />
              <path d="M160 100 C176 52 230 26 280 34 C330 42 364 78 356 122 C348 166 298 194 248 186 C198 178 144 148 160 100 Z" />
              <path d="M640 300 C660 240 730 208 792 218 C854 228 890 272 880 322 C870 372 810 404 748 396 C686 388 620 360 640 300 Z" />
            </g>

            <g stroke="#1e2a20" strokeWidth="2" fill="#141d16" aria-hidden="true">
              {TREES.map((tree) => (
                <g key={`dark-${tree.x}`} transform={`translate(${tree.x},330) scale(${tree.scale})`}>
                  <path d={TREE_PATH} />
                </g>
              ))}
            </g>

            <polygon points={beamPoints(spread)} fill="url(#beam-outer)" opacity={0.4 + t * 0.6} />
            <polygon points={beamPoints(coreSpread)} fill="url(#beam-core)" opacity={0.35 + t * 0.65} />

            <g stroke="#ffd08a" strokeWidth="2" fill="none" strokeLinejoin="round" aria-hidden="true">
              {TREES.map((tree, index) => (
                <g
                  key={`lit-${tree.x}`}
                  transform={`translate(${tree.x},330) scale(${tree.scale})`}
                  opacity={litFor(index)}
                >
                  <path d={TREE_PATH} />
                </g>
              ))}
            </g>

            <path d="M0 330 H900" stroke="#2c3a2c" strokeWidth="2" />

            <circle
              cx={EMITTER.x}
              cy={EMITTER.y}
              r={30 + t * 62}
              fill="url(#emitter-glow)"
              opacity={0.45 + t * 0.55}
            />
            <g stroke="#8b9382" strokeWidth="2.4" fill="none" strokeLinecap="round">
              <circle cx={EMITTER.x} cy={EMITTER.y} r="11" fill="#0e1410" />
              <path d={`M${EMITTER.x - 11} ${EMITTER.y} h-12`} />
              <path d={`M${EMITTER.x} ${EMITTER.y - 11} v-9`} />
              <path d={`M${EMITTER.x} ${EMITTER.y + 11} v9`} />
            </g>
          </svg>
        </div>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <label
              htmlFor="output-dial"
              className="mb-3 block font-mono text-[0.62rem] tracking-[0.18em] uppercase text-chrome-fg-2"
            >
              Output — drag to set the beam
            </label>
            <input
              id="output-dial"
              type="range"
              min={0}
              max={100}
              step={1}
              value={dial}
              onChange={(event) => setDial(Number(event.target.value))}
              className="dial"
            />
            <div className="mt-2.5 flex justify-between font-mono text-[0.58rem] tracking-[0.1em] text-chrome-fg-2 tabular-nums">
              <span>{range.minLumens} lm — walk-out</span>
              <span>{Math.round((range.minLumens + range.maxLumens) / 2)} lm</span>
              <span>{range.maxLumens} lm — scan</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px border border-chrome-line bg-chrome-line sm:grid-cols-3">
            <Readout label="Output" value={lumens} unit="lm" />
            <Readout label="Beam reach" value={reach} unit="yd" />
            <Readout
              label="Runtime"
              value={runtime < 10 ? runtime.toFixed(1) : Math.round(runtime)}
              unit="hr"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3.5">
          <Button type="button" variant="blaze" onClick={() => add(product)}>
            Add the {product.name} — {money(product.price)}
          </Button>
          <ButtonLink href="/#catalog" variant="ghost">
            All lighting
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Readout({
  label,
  value,
  unit,
}: {
  label: string;
  /** A string when the value needs a fixed decimal, e.g. 4.7 hours. */
  value: number | string;
  unit: string;
}) {
  return (
    <div className="bg-spruce px-4.5 py-4">
      <span className="block font-mono text-[0.58rem] tracking-[0.16em] uppercase text-chrome-fg-2">
        {label}
      </span>
      <b className="mt-2 block font-display text-[clamp(1.7rem,3vw,2.3rem)] font-bold leading-none tabular-nums text-lamp">
        {value}
        <span className="ml-[0.18em] font-body text-[0.5em] font-medium tracking-[0.06em] text-chrome-fg-2">
          {unit}
        </span>
      </b>
    </div>
  );
}
