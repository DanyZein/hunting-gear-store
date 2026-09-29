import { Hero } from "@/components/Hero";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { Teaser } from "@/components/Teaser";
import { TrustStrip } from "@/components/TrustStrip";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPages, getProducts, getSettings } from "@/lib/content";

/**
 * The landing page.
 *
 * This used to be the whole site: nine sections stacked, ~15,000px on a phone.
 * Each section now has its own route and appears here only as a teaser, so the
 * home page is a front door rather than the destination. It holds no markup of
 * its own beyond the two bands that only make sense here — the featured row and
 * the teaser grid.
 */
export default async function HomePage() {
  const [pages, products, settings] = await Promise.all([
    getPages(),
    getProducts(),
    getSettings(),
  ]);

  const { hero, featured, explore, newsletter } = pages.home;

  // Order is whatever `content/products.json` says, so which four lead the page
  // stays an editorial decision rather than a derived one.
  const picks = products.slice(0, 4);

  return (
    <>
      <Hero hero={hero} settings={settings} />
      <TrustStrip settings={settings} />

      <section className="py-[clamp(52px,7vw,100px)]">
        <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <Eyebrow>{featured.eyebrow}</Eyebrow>
              <SectionHeading className="mt-2.5">{featured.headline}</SectionHeading>
            </div>
            <ButtonLink href={featured.cta.href} variant="line" size="sm">
              {featured.cta.label}
            </ButtonLink>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-[clamp(14px,1.8vw,22px)] min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {picks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface-2 py-[clamp(52px,7vw,100px)]">
        <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
          <Eyebrow>{explore.eyebrow}</Eyebrow>
          <SectionHeading className="mt-2.5">{explore.headline}</SectionHeading>

          <div className="mt-7 grid grid-cols-1 gap-[clamp(14px,1.8vw,22px)] min-[640px]:grid-cols-2 lg:grid-cols-3">
            {explore.items.map((item) => (
              <Teaser
                key={item.href}
                eyebrow={item.eyebrow}
                teaser={item.teaser}
                href={item.href}
              />
            ))}
          </div>
        </div>
      </section>

      <Newsletter content={newsletter} />
    </>
  );
}
