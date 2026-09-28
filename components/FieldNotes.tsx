import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductArt } from "@/lib/art";
import type { HomeContent } from "@/lib/types";

/**
 * The founder's letter, set as an annotated field notebook: a mono annotation
 * in the left gutter against each paragraph, hairlines between entries. The
 * annotations are the point. They date the failures, which is what makes the
 * story worth reading instead of a brand paragraph.
 */
export function FieldNotes({ content }: { content: HomeContent["notes"] }) {
  const { plate } = content;

  return (
    <section id="notes" className="py-[clamp(52px,7vw,100px)]">
      <div className="mx-auto grid w-full max-w-[1300px] gap-10 px-[var(--gut)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
        <div className="overflow-hidden rounded-[3px] border border-line bg-spruce">
          <div className="relative grid aspect-[4/5] place-items-center max-lg:aspect-[16/10]">
            <span className="topo-strong pointer-events-none absolute inset-0" aria-hidden="true" />
            <ProductArt art={plate.art} className="relative size-[52%] text-moss-2" strokeWidth={1.6} />
          </div>
          <div className="flex justify-between gap-3 border-t border-chrome-line px-4 py-3 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-chrome-fg-2">
            <span>{plate.caption}</span>
            <span>{plate.place}</span>
          </div>
        </div>

        <div>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 className="mt-2.5 max-w-[18ch] font-display text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.96] tracking-[-0.014em] text-balance">
            {content.headline}
          </h2>

          <div className="mt-6">
            {content.entries.map((entry) => (
              <div
                key={entry.annotation}
                className="grid gap-1.5 border-t border-dashed border-line py-4 first:border-t-0 first:pt-0 lg:grid-cols-[104px_minmax(0,1fr)] lg:gap-5"
              >
                <p className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-fg-3 lg:pt-1">
                  {entry.annotation}
                </p>
                <p className="text-[1.02rem] leading-[1.68] text-fg-2">{entry.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t border-line pt-4.5 font-mono text-[0.68rem] tracking-[0.1em] uppercase text-fg-3">
            <b className="mb-1 block font-display text-[1.5rem] font-bold tracking-[0.06em] uppercase text-fg">
              {content.signature.name}
            </b>
            {content.signature.role}
          </p>
        </div>
      </div>
    </section>
  );
}
