import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <section className="py-[clamp(80px,12vw,160px)]">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-3 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,4.4rem)] font-bold uppercase leading-[0.96] tracking-[-0.02em]">
          Nothing on this trail
        </h1>
        <p className="mt-4 max-w-[48ch] text-[1.02rem] leading-[1.62] text-fg-2">
          That page does not exist. It may have been a discontinued piece, or the link may have a
          typo in it.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/#catalog" variant="solid">
            Back to the catalog
          </ButtonLink>
          <ButtonLink href="/" variant="line">
            Home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
