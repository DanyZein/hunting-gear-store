/**
 * The content seam.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every page and component reads content through THIS FILE and nothing else.
 *  No page imports from /content, and no page touches the filesystem.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * That rule is the whole reason "add a CMS later" stays cheap. When Payload
 * arrives you write `lib/sources/payload.ts`, implement the same six functions
 * against Payload's local API, and flip the one line below. Every page keeps
 * working, because every page only ever called these functions.
 *
 * If you import products.json directly into a component, adding the CMS becomes
 * a rewrite of every file that did it.
 */

import { fileSource } from "./sources/file";
import type { ContentSource, Product } from "./types";

/* ─────────────── the line you change when Payload lands ─────────────── */

const source: ContentSource = fileSource;

// import { payloadSource } from "./sources/payload";
// const source: ContentSource = payloadSource;

/* ────────────────────────────────────────────────────────────────────── */

export function getSettings() {
  return source.getSettings();
}

export function getTaxonomy() {
  return source.getTaxonomy();
}

export function getProducts() {
  return source.getProducts();
}

export function getProduct(slug: string) {
  return source.getProduct(slug);
}

export function getReports() {
  return source.getReports();
}

export function getHomePage() {
  return source.getHomePage();
}

/**
 * Convenience for the product page and the kit builder: the same list, indexed
 * by id. Derived from getProducts() rather than being its own source call, so a
 * new backend only has to implement the six functions above.
 */
export async function getProductMap(): Promise<Record<string, Product>> {
  const products = await getProducts();
  return Object.fromEntries(products.map((p) => [p.id, p]));
}

/** Products that take part in the layering system. */
export async function getLayeredProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.layer);
}

export type { Product, Settings, Taxonomy, Report, HomeContent, GroundId, GroupId, LayerKey, ArtKey } from "./types";
