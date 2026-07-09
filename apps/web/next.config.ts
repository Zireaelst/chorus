import type { NextConfig } from 'next'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();


// apps/web Next.js configuration — marketing site
// FRONTEND_GUIDELINES.md: "apps/web — 360px, fully responsive, mobile-first"
// All images go through next/image — FRONTEND_GUIDELINES.md: "no raw <img> tags"

const config: NextConfig = {

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },

  // Strict mode to surface React 19 deprecation warnings early
  reactStrictMode: true,

  transpilePackages: ['@chorus/ui', '@chorus/config', '@chorus/design-tokens', '@chorus/types'],

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
