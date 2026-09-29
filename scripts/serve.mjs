/**
 * Preview server for the static export.
 *
 * `output: "export"` removes `next start`, so this stands in for it. It exists
 * instead of `npx serve` so that previewing needs no network and no extra
 * dependency, and — more usefully — so it behaves like the host does rather
 * than like a dev server.
 *
 * The three things it copies from Apache/LiteSpeed on purpose:
 *
 *   1. A route only resolves through its directory index. There is no fallback
 *      that rewrites an unknown path to `/index.html`. If a link is wrong, this
 *      shows a 404 here instead of hiding it until after the upload. A dev
 *      server with rewrites will happily serve a broken site.
 *   2. `404.html` is used for misses, the same as ErrorDocument does.
 *   3. Trailing slashes are redirected to the canonical URL, so you see the
 *      real post-redirect address bar.
 *
 * It does NOT apply .htaccess. Compression and cache headers are Hostinger's
 * business at that point; run Lighthouse against the live site, not this.
 *
 *   pnpm build && pnpm preview
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const PORT = Number(process.env.PORT ?? 4000);

// Running this before `pnpm build` would 404 every route, which reads as a
// broken app rather than a missing build. Say so instead.
if (!(await stat(ROOT).then((s) => s.isDirectory()).catch(() => false))) {
  console.error(`No export found at ${ROOT}\nRun \`pnpm build\` first.`);
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

/** File exists and is a regular file? */
async function isFile(target) {
  try {
    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}

async function resolve(urlPath) {
  // Decode, then keep the resolved path inside ROOT. A request for
  // `../../etc/passwd` would otherwise escape the export directory.
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(urlPath, "http://localhost").pathname);
  } catch {
    return null;
  }
  if (pathname.includes("\0")) return null;

  const target = path.join(ROOT, pathname);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;

  // `/products/foo` -> `/products/foo/index.html`, the directory-index lookup
  // the host performs. Also covers the bare `/`.
  if (await isFile(path.join(target, "index.html"))) {
    return { file: path.join(target, "index.html") };
  }

  // A real file, e.g. `/_next/static/chunk.js` or `/404.html`.
  if (path.extname(target) && (await isFile(target))) {
    return { file: target };
  }

  return null;
}

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }).end("Method Not Allowed");
    return;
  }

  const urlPath = req.url ?? "/";

  // Canonicalise the trailing slash the way the host does: a directory route
  // without one gets a 301 to the slashed form, so relative asset paths inside
  // the page resolve against the right base.
  const withoutQuery = urlPath.split(/[?#]/)[0];
  if (!withoutQuery.endsWith("/") && !path.extname(withoutQuery)) {
    const hit = await resolve(withoutQuery + "/");
    if (hit) {
      const query = urlPath.slice(withoutQuery.length);
      res.writeHead(301, { Location: `${withoutQuery}/${query}` });
      res.end();
      return;
    }
  }

  const hit = await resolve(urlPath);

  if (!hit) {
    const notFound = path.join(ROOT, "404.html");
    if (await isFile(notFound)) {
      res.writeHead(404, { "Content-Type": MIME[".html"] });
      if (method === "HEAD") return res.end();
      createReadStream(notFound).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": MIME[".txt"] }).end("404");
    }
    console.log(`404  ${urlPath}`);
    return;
  }

  const ext = path.extname(hit.file).toLowerCase();
  const headers = { "Content-Type": MIME[ext] ?? "application/octet-stream" };
  if (ext === ".html") headers["Cache-Control"] = "no-cache";

  res.writeHead(200, headers);
  if (method === "HEAD") return res.end();
  createReadStream(hit.file).pipe(res);
  console.log(`200  ${urlPath}`);
});

server.listen(PORT, () => {
  console.log(`Static export served from out/`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop.\n`);
});
