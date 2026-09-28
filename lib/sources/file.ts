/**
 * File-backed content source.
 *
 * The only module in the app that reads from disk. Everything else goes through
 * `lib/content.ts`. When you add Payload you write a sibling to this file and
 * this one stops being imported — you do not have to delete it, and keeping it
 * around is useful for tests and for `next build` on a machine with no database.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  ContentSource,
  HomeContent,
  Product,
  Report,
  Settings,
  Taxonomy,
} from "../types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Read and parse one JSON file. Cached for the life of the process, which is
 * what you want in dev (a restart picks up edits) and free in production
 * (one read at build time).
 */
const cache = new Map<string, unknown>();

async function readJson<T>(file: string): Promise<T> {
  const cached = cache.get(file);
  if (cached !== undefined) return cached as T;

  const full = path.join(CONTENT_DIR, file);
  let raw: string;
  try {
    raw = await readFile(full, "utf8");
  } catch {
    throw new Error(
      `Content file missing: content/${file}. ` +
        `If you meant to read this from Payload, point lib/content.ts at a different source.`,
    );
  }

  let parsed: T;
  try {
    parsed = JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(
      `Content file is not valid JSON: content/${file} — ${(err as Error).message}`,
    );
  }

  cache.set(file, parsed);
  return parsed;
}

export const fileSource: ContentSource = {
  getSettings: () => readJson<Settings>("settings.json"),
  getTaxonomy: () => readJson<Taxonomy>("taxonomy.json"),
  getReports: () => readJson<Report[]>("reports.json"),

  async getProducts() {
    const { products } = await readJson<{ products: Product[] }>("products.json");
    return products;
  },

  async getProduct(slug) {
    const { products } = await readJson<{ products: Product[] }>("products.json");
    return products.find((p) => p.id === slug) ?? null;
  },

  async getHomePage() {
    const { home } = await readJson<{ home: HomeContent }>("pages.json");
    return home;
  },
};
