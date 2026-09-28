# Ninebark Field Supply

A hunting apparel and lighting storefront. Next.js 16 (App Router), TypeScript,
Tailwind v4.

**There is no database, no CMS, no checkout and no accounts.** Content lives in
JSON files under `/content`, and every read goes through one module. That is the
whole design, and it exists so adding Payload later is a data-layer swap instead
of a rewrite.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # prerenders every route statically
npm run typecheck
```

---

## The one rule

**Pages and components never import from `/content`. They only call
`lib/content.ts`.**

```
app/**  ──▶  lib/content.ts  ──▶  lib/sources/file.ts  ──▶  /content/*.json
                  │
                  └──▶  lib/sources/payload.ts   (the future)
```

Today only three route files import it:

- `app/layout.tsx`
- `app/page.tsx`
- `app/products/[slug]/page.tsx`

Break the rule — reach into `products.json` from a component — and every file
that did it has to be edited when the CMS lands. That is the rewrite you are
trying to avoid. If you catch yourself typing `import ... from "@/content/..."`,
add a function to `lib/content.ts` instead.

You can check the rule still holds at any time:

```bash
grep -rn "products.json\|settings.json\|pages.json" app components   # should be empty
```

---

## Adding the database later

When the catalog outgrows files, this is the whole migration:

**1. Write the second source.** Create `lib/sources/payload.ts` implementing the
`ContentSource` interface from `lib/types.ts`. That is six functions:

```ts
getSettings()   getTaxonomy()   getProducts()
getProduct()    getReports()    getHomePage()
```

Two of them are free, because `lib/content.ts` derives `getProductMap()` and
`getLayeredProducts()` from `getProducts()` rather than calling the source.

**2. Flip one line** in `lib/content.ts`:

```ts
// const source: ContentSource = fileSource;
import { payloadSource } from "./sources/payload";
const source: ContentSource = payloadSource;
```

**3. Fill in `.env.local`** from `.env.example`.

Nothing in `app/` or `components/` changes. `fileSource` stays in the repo —
it costs nothing and lets `next build` run on a machine with no database.

### Setup notes worth keeping

These come from the Neon/Payload research and are the difference between a free
tier and an overage:

- **Use the pooled connection string** and keep `sslmode=require`. The host has
  `-pooler` in it.
- **Pin `pool.max` low (around 3).** Serverless instances multiply; without a
  cap they exhaust Postgres connections on a busy deploy.
- **Watch Payload's job queue.** It can wake Neon on a schedule and burn
  compute hours on a site with no visitors. If you see CU-hours climb with flat
  traffic, constrain the queue's auto-run or drive it from an external cron.
  Compute sleeps after 5 minutes idle, so an idle site should cost zero.
- **Media goes to Vercel Blob, not Postgres.** Neon's 0.5GB is text and metadata
  only, which is kilobytes per product. It will not be the thing that fills up.
- **Hostinger is the domain, not the database.** Payload does not speak MySQL,
  and shared hosting cannot run the persistent Node process Payload needs.

### The media path

`Product.image` already exists and `ProductCard` / the product page already
render it with `ProductArt` as the fallback. When photos land:

1. Add the Blob hostname to `next.config.ts` (`images.remotePatterns`).
2. Set `image` on the product in the CMS.
3. Swap the two `<img>` tags for `next/image` — each is marked with a comment.

Products without a photo keep their illustration, so the migration can happen
one product at a time.

---

## Where the content lives

| File                       | Holds                                                       |
| -------------------------- | ----------------------------------------------------------- |
| `content/settings.json`    | Brand, contact, season opener, nav, announcements, trust strip, footer |
| `content/products.json`    | The catalog, keyed by `id` (which is also the URL slug)      |
| `content/taxonomy.json`    | Grounds, category groups, layering rows                      |
| `content/pages.json`       | Home page copy, section by section                           |
| `content/reports.json`     | Field reports                                                |

### Adding a product

Append to the `products` array in `content/products.json`. The types in
`lib/types.ts` are the contract; a missing field fails `npm run typecheck`.

Two things are enforced rather than optional:

- **`specs` is exactly three entries.** The card's spec strip is a three-column
  grid, and a row of cards only reads as a comparison table if every card has
  the same three cells in the same order.
- **`art` must name a key in `lib/art.tsx`.** Add a drawing there or set `image`
  instead.

`ground` ids and `group` ids must exist in `taxonomy.json`, and `layer` must be
one of `base` / `mid` / `outer` for a piece to appear in the kit builder.

### Prose-heavy pages later

Everything is JSON today, which suits structured content. If you start writing
long-form field notes or care guides, MDX under `/content` is the natural next
step — add a `getPage(slug)` to the `ContentSource` interface and load it
through the same seam. The rule does not change.

---

## Project layout

```
app/
  layout.tsx              fonts, providers, header/footer/drawers
  page.tsx                the home page — composes sections, no markup of its own
  products/[slug]/page.tsx  product detail, statically generated per product
  not-found.tsx
  globals.css             design tokens + the few components Tailwind cannot express
components/
  store/                  client state: cart, drawers, toast, catalog filters
  ui/                     Button, Chip, Eyebrow, Scrim, icons
  <section>.tsx           one file per page section
content/                  all copy and catalog data
lib/
  content.ts              THE SEAM
  sources/file.ts         reads /content — the only fs access in the app
  types.ts                the contract every source must satisfy
  art.tsx                 placeholder product illustrations
  format.ts, cn.ts
design/concept.html       the original single-file design concept, for reference
```

### Server vs client

The page tree is server-rendered. Client components are the interactive islands:
the cart, drawers, filters, the kit builder and the beam dial. `StoreProvider`
and `FilterProvider` are client components in `layout.tsx`, but `children` is
passed as a slot, so the pages themselves stay on the server.

---

## Design notes

- **Palette.** Dark spruce chrome framing a stone "spec sheet" body. Blaze
  orange (`#ef6a24`) is the only loud colour and it earns it — that is the
  legally-required hunter safety colour, not a decoration.
- **Type.** Barlow Condensed for display, Barlow for running text, JetBrains
  Mono for anything measured. Specs are mono because they are instrument
  readings.
- **Themes.** Light and dark both defined as tokens in `globals.css`. The dark
  chrome sections are dark in both themes on purpose — that is the brand, not a
  theme choice. An explicit choice via `data-theme` on `<html>` overrides the OS
  setting in both directions.
- **Illustrations.** Hand-drawn SVG on a 240×240 grid at a consistent 3px
  stroke, so the catalog reads as one system with no photography. They are
  placeholders and are designed to be replaced.

---

## Deliberately missing

Both of these assume a database, so both are deferred with it:

- **Forms that store submissions.** The newsletter validates the address in the
  browser and tells you nothing was saved. When there is somewhere to put it,
  point it at a Payload collection.
- **Comments and user accounts.**

There is also no checkout. The cart is real — it holds lines, quantities and a
subtotal, and persists to `localStorage` — but the button says plainly that no
payment provider is connected. Nothing here should ever look like it took money
when it did not.

---

## Deploying

Vercel. The build is fully static today, so it needs no environment variables
until Payload arrives.

`CLAUDE.md` and `AGENTS.md` in the repo root were generated by Next.js itself
for AI coding agents. Delete them or set `agentRules: false` in `next.config.ts`
if you would rather not have them.
