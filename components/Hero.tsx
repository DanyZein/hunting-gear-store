import { CountdownCells } from "@/components/Countdown";
import { ButtonLink } from "@/components/ui/Button";
import type { HomeContent, Settings } from "@/lib/types";

/**
 * The hero states the thesis: this is a cold-weather hunting catalog, and the
 * thing a hunter is actually thinking about — opening day — is on the page,
 * counting down, rather than a stock photo of a mountain.
 */
export function Hero({ content, settings }: { content: HomeContent; settings: Settings }) {
  const { hero } = content;
  const { season } = settings;

  return (
    <section className="relative overflow-hidden bg-chrome text-chrome-fg">
      <div className="topo pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[66%]" aria-hidden="true" />

      <div className="relative z-1 mx-auto w-full max-w-[1300px] px-[var(--gut)] pt-[clamp(56px,9vw,116px)] pb-[clamp(42px,6vw,74px)]">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="mb-[22px] flex items-center gap-2.5">
              <i className="block h-px w-[34px] bg-blaze" />
              <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-chrome-fg-2">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="max-w-[14ch] font-display text-[clamp(2.7rem,7.2vw,5.6rem)] font-bold uppercase leading-[0.96] tracking-[-0.022em] text-balance">
              {hero.headline}
            </h1>

            <p className="mt-[22px] max-w-[48ch] text-[clamp(1.02rem,1.5vw,1.18rem)] leading-[1.62] text-chrome-fg-2">
              {hero.body}
            </p>

            <div className="mt-[30px] flex flex-wrap gap-3">
              <ButtonLink href={hero.primaryCta.href} variant="blaze">
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="ghost">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <div className="max-w-[460px] rounded-[3px] border border-chrome-line bg-[rgba(20,29,22,0.72)] p-[22px] backdrop-blur-[6px]">
            <div className="mb-4 flex items-center gap-2">
              <i className="block size-1.5 rounded-full bg-blaze animate-pulse-dot" />
              <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-chrome-fg-2">
                Next opener
              </span>
            </div>

            <CountdownCells season={season} />

            <p className="mt-4 border-t border-chrome-line pt-3.5 text-[0.82rem] text-chrome-fg-2">
              {season.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
