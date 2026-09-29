import type { Metadata } from "next";

import { Catalog } from "@/components/Catalog";
import { GroundPicker } from "@/components/GroundPicker";
import { getPages, getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Ninebark catalog: layering systems, boots, packs and lights for cold-weather hunters, filtered by the ground you hunt.",
};

/**
 * `/shop` is the one route carrying two sections, and that is deliberate.
 *
 * `GroundPicker` writes the ground filter and `Catalog` reads it. Splitting them
 * onto separate routes would leave the picker changing state that nothing on
 * screen responds to. Filters live in the URL (`?ground=timber`) so the
 * combined view is still shareable and survives a refresh.
 */
export default async function ShopPage() {
  const [pages, products] = await Promise.all([getPages(), getProducts()]);

  return (
    <>
      {/* The picker takes the h1, not the grid. It comes first in the DOM, and
          an h2 before the h1 is a heading-order violation — a screen reader
          meets a level-2 heading before the page's level-1. "Where are you
          hunting?" is the first thing this page says, so it is the heading that
          names it. The grid below is a subheading of that. */}
      <GroundPicker content={pages.shop.grounds} products={products} headingLevel="h1" />
      <Catalog products={products} content={pages.shop.catalog} />
    </>
  );
}
