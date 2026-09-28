import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are hand-drawn SVG today, so there is no remote loader configured.
  // When you move product photos to Vercel Blob, add the hostname here:
  //
  // images: {
  //   remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  // },
};

export default nextConfig;
