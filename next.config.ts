import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stops `next dev` writing AGENTS.md and CLAUDE.md into the repo root on every
  // run. They are instructions for AI coding agents, and they reappear if you
  // just delete them.
  agentRules: false,

  // Emits a plain folder of HTML/CSS/JS into `out/` instead of a server bundle.
  // `out/` is what gets uploaded to Hostinger. Nothing in this app needs a Node
  // process at request time: every route prerenders from /content at build time.
  //
  // The trade-off is that `next start` no longer runs. Use `pnpm preview`.
  output: "export",

  // Writes `products/alpha-jacket/index.html` rather than `products/alpha-jacket.html`.
  //
  // This matters on shared hosting. Apache and LiteSpeed do not map the
  // extensionless `/products/alpha-jacket` onto `alpha-jacket.html`, so without
  // this every product URL 404s unless you hand-write rewrite rules. With it,
  // the file lands in a directory and the host's own directory-index handling
  // serves it. URLs gain a trailing slash, which is the only visible cost.
  trailingSlash: true,

  images: {
    // Required by `output: "export"`: there is no server to resize images on
    // demand. Next still emits width/height and lazy-loads, it just serves the
    // original file.
    //
    // `ProductCard` and the product page use plain <img> today. When product
    // photos land, swap them for next/image and they will work as-is — no
    // remotePatterns needed, because an unoptimized loader never fetches
    // anything from the server side.
    unoptimized: true,
  },
};

export default nextConfig;
