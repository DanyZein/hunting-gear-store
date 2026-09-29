import type { Metadata } from "next";

import { KitBuilder } from "@/components/KitBuilder";
import { getPages, getProducts, getTaxonomy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Layering",
  description:
    "Build a three-piece layering kit. Pick one piece from each layer and the three are priced together at kit pricing.",
};

export default async function LayeringPage() {
  const [pages, products, taxonomy] = await Promise.all([
    getPages(),
    getProducts(),
    getTaxonomy(),
  ]);

  return (
    <KitBuilder
      products={products.filter((product) => product.layer)}
      layers={taxonomy.layers}
      content={pages.layering.system}
      headingLevel="h1"
    />
  );
}
