/**
 * Shape of everything the site renders.
 *
 * These types are the contract between the pages and `lib/content.ts`. They are
 * deliberately storage-agnostic: nothing here says "JSON file" or "Postgres
 * row". When Payload arrives it has to satisfy these same types, and no page
 * has to change.
 */

export type GroundId = "alpine" | "timber" | "prairie" | "marsh";

export type GroupId = "apparel" | "footwear" | "packs" | "lighting";

export type LayerKey = "base" | "mid" | "outer";

/** Keys into the placeholder illustration set in `lib/art.tsx`. */
export type ArtKey =
  | "jacket"
  | "bib"
  | "vestBlaze"
  | "fleece"
  | "vestDown"
  | "crew"
  | "zipBase"
  | "boot"
  | "rubberBoot"
  | "pack"
  | "headlamp"
  | "spotlight";

/** One cell of the mono spec strip printed across the bottom of a card. */
export interface Spec {
  /** Short field label, e.g. "Temp". Kept to one word so the strip stays even. */
  k: string;
  /** Value with its real unit, e.g. "0°F". */
  v: string;
}

export interface Product {
  /** URL slug. Also the cart line key. */
  id: string;
  name: string;
  /** Display name for the category, e.g. "Mid layer". May be more specific than `group`. */
  category: string;
  /** Broad bucket used by the catalog filter chips. */
  group: GroupId;
  /** Present only for garments that take part in the layering system. */
  layer?: LayerKey;
  /** Whole dollars. Cents never survive contact with a gear catalog. */
  price: number;
  /** Optional strike-through price. */
  compareAt?: number;
  grounds: GroundId[];
  badge?: string;
  /** Exactly three, so every card's spec strip lines up across a row. */
  specs: Spec[];
  /** Placeholder illustration. Ignored when `image` is set. */
  art: ArtKey;
  /** Real photo URL. Empty until media moves to Vercel Blob. */
  image?: string;
  /** One-line hook for the product page and meta description. */
  summary?: string;
  /** Body paragraphs for the product page. */
  description?: string[];
  features?: string[];
}

export interface Ground {
  id: GroundId | "all";
  name: string;
  sub: string;
  /** SVG path data drawn on a 30x30 viewBox. */
  icon: string;
}

/** Broad bucket for the category filter row. */
export interface Group {
  id: GroupId | "all";
  name: string;
}

export interface Layer {
  key: LayerKey;
  name: string;
  note: string;
}

export interface Taxonomy {
  grounds: Ground[];
  groups: Group[];
  layers: Layer[];
}

export interface Report {
  quote: string;
  name: string;
  place: string;
  conditions: string;
}

export interface TrustPoint {
  title: string;
  body: string;
  /** Key into the icon set in `components/TrustStrip.tsx`. */
  icon: "freight" | "trial" | "repair" | "fit";
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

/** A link in the header. `group` also applies a catalog filter on arrival. */
export interface NavLink {
  label: string;
  href: string;
  group?: GroupId;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

/**
 * A top-level header item. Items with `columns` open the mega menu on hover or
 * keyboard focus; items without one are a plain link.
 */
export interface NavItem {
  label: string;
  href: string;
  columns?: NavColumn[];
}

/**
 * The next season opener. Site-wide rather than per-page because both the top
 * bar and the home hero count down to it.
 */
export interface Season {
  label: string;
  /** Month is 1-based, matching how you would say it out loud. */
  month: number;
  day: number;
  hour: number;
  minute: number;
  note: string;
}

export interface Settings {
  brand: { name: string; sub: string };
  /** Default meta description for pages that do not set their own. */
  description: string;
  contact: { address: string; phone: string; email: string };
  season: Season;
  nav: NavItem[];
  /** Rotates through the top bar. */
  announcements: string[];
  trust: TrustPoint[];
  /** Cart total at or above which freight is free. */
  freeFreightThreshold: number;
  /** Copy under the freight line when the threshold is not met. */
  freightNote: string;
  footer: FooterColumn[];
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  grounds: { eyebrow: string; headline: string; body: string };
  system: { eyebrow: string; headline: string; body: string; note: string };
  catalog: { eyebrow: string; headline: string };
  lighting: {
    eyebrow: string;
    headline: string;
    body: string;
    /** Headlamp the beam rig demonstrates. Drives the "add" button. */
    productId: string;
    /**
     * The three numbers the dial moves between. Runtime runs the other way from
     * output — that inverse relationship is the whole reason the dial exists.
     */
    dial: {
      minLumens: number;
      maxLumens: number;
      reachAtMinYd: number;
      reachAtMaxYd: number;
      runtimeAtMinHr: number;
      runtimeAtMaxHr: number;
    };
  };
  notes: {
    eyebrow: string;
    headline: string;
    /** Year / annotation / paragraph triples rendered as an annotated letter. */
    entries: { annotation: string; body: string }[];
    signature: { name: string; role: string };
    plate: { art: ArtKey; caption: string; place: string };
  };
  reports: { eyebrow: string; headline: string };
  newsletter: { headline: string; body: string; note: string };
}

/**
 * Everything a page can ask for. A new backend implements this interface and
 * nothing above it changes.
 */
export interface ContentSource {
  getSettings(): Promise<Settings>;
  getTaxonomy(): Promise<Taxonomy>;
  getProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getReports(): Promise<Report[]>;
  getHomePage(): Promise<HomeContent>;
}
