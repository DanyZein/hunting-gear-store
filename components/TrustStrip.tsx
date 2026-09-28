import { TRUST_ICONS } from "@/components/ui/icons";
import type { Settings } from "@/lib/types";

/**
 * Four promises. Each one is a real policy a shop has to honor rather than a
 * badge. "Repaired, not replaced" is a commitment with a cost attached, which
 * is the point of putting it here.
 */
export function TrustStrip({ settings }: { settings: Settings }) {
  return (
    <section className="border-t border-chrome-line bg-spruce text-chrome-fg">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <div className="grid gap-px bg-chrome-line sm:grid-cols-2 lg:grid-cols-4">
          {settings.trust.map((point) => {
            const Icon = TRUST_ICONS[point.icon];
            return (
              <div key={point.title} className="flex items-start gap-3 bg-spruce px-4 py-5 sm:px-6">
                <Icon className="mt-0.5 size-5 flex-none text-blaze" />
                <div>
                  <b className="block font-display text-base font-semibold tracking-[0.05em] uppercase">
                    {point.title}
                  </b>
                  <span className="text-[0.82rem] leading-snug text-chrome-fg-2">{point.body}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
