// Tailwind CSS preset — the single source of truth for all design tokens.
// Source: DESIGN_SYSTEM.md — "If a value used in a component doesn't trace back to a token
// defined here, that's a bug, not a style choice."
//
// All color values are taken verbatim from DESIGN_SYSTEM.md and individually
// contrast-checked against WCAG 2.1. Do not modify values without re-running
// the contrast check and updating DESIGN_SYSTEM.md simultaneously.

import type { Config } from 'tailwindcss'

const preset: Config = {
  content: [],
  darkMode: 'class', // Dark mode via class — DESIGN_SYSTEM.md: cookie sets class="dark" server-side
  theme: {
    // ── Colors ──────────────────────────────────────────────────────────────
    // DESIGN_SYSTEM.md: "Consume semantic or component tokens. Reference raw hex
    // or px values in component code: Don't."
    // Colors are defined as CSS custom property references so they respond to
    // the .dark class automatically via globals.css definitions.
    extend: {
      colors: {
        // Canvas & surfaces
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',

        // Borders
        'border-hairline': 'var(--color-border-hairline)',
        'border-strong': 'var(--color-border-strong)',

        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',

        // Accent — DESIGN_SYSTEM.md: "reserved, without exception, for moments where
        // something has been cryptographically verified." Never for hover/active states.
        'accent-verify': 'var(--color-accent-verify)',

        // Status
        'status-error': 'var(--color-status-error)',
        'status-warning': 'var(--color-status-warning)',
        'status-success': 'var(--color-status-success)',
      },

      // ── Typography ─────────────────────────────────────────────────────────
      // DESIGN_SYSTEM.md typography scale — verbatim values
      fontFamily: {
        // DESIGN_SYSTEM.md: "ship with Inter as an interim substitute for Suisse Int'l
        // until that license is purchased — the two are metrically close enough that
        // layouts won't need rework when the swap happens."
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // GT Sectra license pending — Georgia as interim serif
        display: ['var(--font-display)', 'Georgia', 'ui-serif', 'serif'],
        // JetBrains Mono — loaded via next/font/google
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      fontSize: {
        // DESIGN_SYSTEM.md typography scale
        display: ['56px', { lineHeight: '1.05', fontWeight: '500' }],
        h1: ['40px', { lineHeight: '1.1', fontWeight: '500' }],
        h2: ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        small: ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        // data: monospace, tabular-nums — for timestamps, hashes, proof IDs, currency
        data: ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },

      // ── Spacing ────────────────────────────────────────────────────────────
      // DESIGN_SYSTEM.md: "We use Tailwind's default spacing scale unmodified."
      // No custom spacing values added here — use the default 4px-based scale.

      // ── Border radius ──────────────────────────────────────────────────────
      // DESIGN_SYSTEM.md: verbatim token values
      borderRadius: {
        sm: '4px', // --radius-sm: inputs, small controls
        base: '6px', // --radius-base: default — cards, buttons
        lg: '12px', // --radius-lg: modals, large panels
        pill: '9999px', // --radius-pill: status badges only
      },

      // ── Motion / animation ─────────────────────────────────────────────────
      // DESIGN_SYSTEM.md motion tokens
      transitionDuration: {
        fast: '120ms', // --dur-fast: hover, focus, button press
        base: '200ms', // --dur-base: standard transitions, dropdown open
        reveal: '400ms', // --dur-reveal: redaction reveal/conceal
        scene: '700ms', // --dur-scene: scroll-driven scene steps (marketing only)
      },

      transitionTimingFunction: {
        // Standard ease-out for all transitions except verify
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // --ease-verify: slight overshoot — "should feel like a stamp landing"
        // DESIGN_SYSTEM.md: "used exclusively for the amber verification pulse"
        verify: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ── Elevation ──────────────────────────────────────────────────────────
      // DESIGN_SYSTEM.md: "No drop shadows for structural hierarchy."
      // Only popover gets a minimal shadow for depth cueing.
      boxShadow: {
        none: 'none',
        popover: '0 2px 8px 0 rgb(0 0 0 / 0.08)', // minimal, no blur on structure
      },
    },
  },
  plugins: [],
}

export default preset
