import { Catalog } from "@/components/Catalog";
import { FieldNotes } from "@/components/FieldNotes";
import { GroundPicker } from "@/components/GroundPicker";
import { Hero } from "@/components/Hero";
import { KitBuilder } from "@/components/KitBuilder";
import { LightingRig } from "@/components/LightingRig";
import { Newsletter } from "@/components/Newsletter";
import { Reports } from "@/components/Reports";
import { TrustStrip } from "@/components/TrustStrip";
import { getHomePage, getProducts, getReports, getSettings, getTaxonomy } from "@/lib/content";

export default async function HomePage() {
  const [home, products, taxonomy, reports, settings] = await Promise.all([
    getHomePage(),
    getProducts(),
    getTaxonomy(),
    getReports(),
    getSettings(),
  ]);

  const lightingProduct = products.find((product) => product.id === home.lighting.productId);
  if (!lightingProduct) {
    // A content mistake, not a runtime one. Fail the build with the file and the
    // id named, rather than rendering a section with a hole in it.
    throw new Error(
      `content/pages.json -> home.lighting.productId is "${home.lighting.productId}", ` +
        `but no product with that id exists in content/products.json.`,
    );
  }

  return (
    <>
      <Hero content={home} settings={settings} />
      <TrustStrip settings={settings} />
      <GroundPicker content={home.grounds} products={products} />
      <KitBuilder
        products={products.filter((product) => product.layer)}
        layers={taxonomy.layers}
        content={home.system}
      />
      <Catalog products={products} content={home.catalog} />
      <LightingRig content={home.lighting} product={lightingProduct} />
      <FieldNotes content={home.notes} />
      <Reports content={home.reports} reports={reports} />
      <Newsletter content={home.newsletter} />
    </>
  );
}
