import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarIcon } from "@/components/ui/icons";
import type { Pages, Report } from "@/lib/types";

/**
 * Field reports.
 *
 * Each one ends with real conditions: temperature, wind, hours sat. A review
 * without conditions is a review of nothing.
 */
export function Reports({
  content,
  reports,
  headingLevel = "h2",
}: {
  content: Pages["reports"]["reports"];
  reports: Report[];
  headingLevel?: "h1" | "h2";
}) {
  return (
    <section className="py-[clamp(52px,7vw,100px)]">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <SectionHeading level={headingLevel} className="mt-2.5">
          {content.headline}
        </SectionHeading>

        <div className="mt-8 grid gap-[clamp(14px,2vw,22px)] lg:grid-cols-3">
          {reports.map((report) => (
            <article
              key={report.name}
              className="flex flex-col gap-3.5 rounded-[3px] border border-line bg-surface p-[22px]"
            >
              <div className="flex gap-[3px] text-blaze" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className="size-[13px]" />
                ))}
              </div>

              <p className="text-base leading-[1.6]">{report.quote}</p>

              <p className="mt-auto border-t border-dashed border-line pt-3.5 font-mono text-[0.62rem] leading-[1.7] tracking-[0.08em] text-fg-3">
                <b className="block font-medium tracking-[0.1em] uppercase text-fg">
                  {report.name}
                </b>
                {report.place}
                <br />
                {report.conditions}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
