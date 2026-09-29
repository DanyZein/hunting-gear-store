import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductArt } from "@/lib/art";
import { getProduct, getProducts, getTaxonomy } from "@/lib/content";
import { money } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, products, taxonomy] = await Promise.all([
    getProduct(slug),
    getProducts(),
    getTaxonomy(),
  ]);

  if (!product) notFound();

  const layer = taxonomy.layers.find((entry) => entry.key === product.layer);
  const grounds = taxonomy.grounds.filter(
    (ground) => ground.id !== "all" && product.grounds.includes(ground.id),
  );
  const related = products
    .filter((entry) => entry.group === product.group && entry.id !== product.id)
    .slice(0, 4);

  return (
    <article className="py-[clamp(28px,4vw,52px)]">
      <div className="mx-auto w-full max-w-[1300px] px-[var(--gut)]">
        <nav aria-label="Breadcrumb" className="mb-7 font-mono text-[0.62rem] tracking-[0.12em] uppercase text-fg-3">
          <Link href="/" className="transition-colors hover:text-fg">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/shop/?group=${product.group}`}
            className="transition-colors hover:text-fg"
          >
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fg">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="overflow-hidden rounded-[3px] border border-line bg-spruce">
            <div className="relative grid aspect-square place-items-center">
              <span className="topo-strong pointer-events-none absolute inset-0" aria-hidden="true" />
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- swapped for next/image when photos land in Blob
                <img src={product.image} alt={product.name} className="relative size-full object-cover" />
              ) : (
                <ProductArt art={product.art} className="relative size-[62%] text-chrome-fg-2" />
              )}
            </div>
            {!product.image && (
              <p className="border-t border-chrome-line px-4 py-3 font-mono text-[0.6rem] tracking-[0.12em] uppercase text-chrome-fg-2">
                Illustration, photography pending
              </p>
            )}
          </div>

          <div>
            <Eyebrow>{product.category}</Eyebrow>
            <h1 className="mt-2.5 max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold uppercase leading-[0.96] tracking-[-0.018em] text-balance">
              {product.name}
            </h1>

            <p className="mt-4 font-mono text-[1.5rem] tabular-nums">
              {money(product.price)}
              {product.compareAt && (
                <span className="ml-3 text-[0.9rem] text-fg-3 line-through">
                  {money(product.compareAt)}
                </span>
              )}
            </p>

            {product.summary && (
              <p className="mt-4 max-w-[52ch] text-[1.06rem] leading-[1.6] text-fg-2">
                {product.summary}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <AddToCartButton product={product} />
              {layer && (
                <span className="rounded-[3px] border border-line px-3.5 py-2 font-mono text-[0.62rem] tracking-[0.1em] uppercase text-fg-3">
                  {layer.name} layer: {layer.note}
                </span>
              )}
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-px rounded-[3px] border border-line bg-line sm:grid-cols-3">
              {product.specs.map((spec) => (
                <div key={spec.k} className="bg-surface px-4 py-3.5">
                  <dt className="font-mono text-[0.56rem] tracking-[0.14em] uppercase text-fg-3">
                    {spec.k}
                  </dt>
                  <dd className="mt-1 font-mono text-[1.05rem] tabular-nums">{spec.v}</dd>
                </div>
              ))}
            </dl>

            {grounds.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[0.6rem] tracking-[0.16em] uppercase text-fg-3">
                  Built for
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {grounds.map((ground) => (
                    <span
                      key={ground.id}
                      className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.66rem] tracking-[0.08em] uppercase"
                    >
                      <svg
                        viewBox="0 0 30 30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="size-4"
                      >
                        <path d={ground.icon} />
                      </svg>
                      {ground.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.description && product.description.length > 0 && (
              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
                {product.description.map((paragraph, index) => (
                  <p key={index} className="max-w-[62ch] text-[1.02rem] leading-[1.68] text-fg-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[0.6rem] tracking-[0.16em] uppercase text-fg-3">
                  Spec sheet
                </p>
                <ul className="mt-3 flex flex-col">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="border-b border-dashed border-line py-2 text-[0.94rem] text-fg-2 last:border-b-0"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-[clamp(52px,7vw,100px)]">
            <Eyebrow>More in {product.category}</Eyebrow>
            <div className="mt-6 grid grid-cols-1 gap-[clamp(14px,1.8vw,22px)] min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* h2: the product name above is the page's only h1, so the card
                  titles sit one level below it rather than skipping to h3. */}
              {related.map((entry) => (
                <ProductCard key={entry.id} product={entry} headingLevel="h2" />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
