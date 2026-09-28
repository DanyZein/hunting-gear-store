import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stops `next dev` writing AGENTS.md and CLAUDE.md into the repo root on every
  // run. They are instructions for AI coding agents, and they reappear if you
  // just delete them.
  agentRules: false,

  // Images are hand-drawn SVG today, so there is no remote loader configured.
  // When you move product photos to Vercel Blob, add the hostname here:
  //
  // images: {
  //   remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  // },
};

export default nextConfig;
