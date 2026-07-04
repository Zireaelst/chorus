import type { NextConfig } from 'next'

// apps/web Next.js configuration — marketing site
// FRONTEND_GUIDELINES.md: "apps/web — 360px, fully responsive, mobile-first"
// All images go through next/image — FRONTEND_GUIDELINES.md: "no raw <img> tags"

const config: NextConfig = {
  // Strict mode to surface React 19 deprecation warnings early
  reactStrictMode: true,

  // Disable x-powered-by header — minor security hygiene
  poweredByHeader: false,

  // next/image domains — populated when real content images are added
  images: {
    formats: ['image/avif', 'image/webp'],
    // FRONTEND_GUIDELINES.md: "All images go through next/image — no exceptions"
  },

  // Bundle analyzer can be enabled locally via ANALYZE=true
  // (not installed here — added when needed)
}

export default config
