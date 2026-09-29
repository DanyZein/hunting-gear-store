import type { Metadata } from "next";

import { LightingRig } from "@/components/LightingRig";
import { getPages, getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lighting",
  description:
    "Drag the dial and watch the beam reach the treeline. Output, reach and runtime trade off against each other, and the Nightfall 1400 lets you set the beam for the ground you are standing in.",
};

export default async function LightingPage() {
  const [pages, products] = await Promise.all([getPages(), getProducts()]);
  const content = pages.lighting;

  const product = products.find((entry) => entry.id === content.productId);
  if (!product) {
    // A content mistake, not a runtime one. Fail the build naming the file and
    // the id, rather than rendering a beam rig with nothing to add to the cart.
    throw new Error(
      `content/pages.json -> lighting.productId is "${content.productId}", ` +
        `but no product with that id exists in content/products.json.`,
    );
  }

  return <LightingRig content={content} product={product} headingLevel="h1" />;
}
