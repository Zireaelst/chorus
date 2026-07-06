// packages/ui/src/tokens/motion-tokens.ts
// Source: DESIGN_SYSTEM.md
// Duration in seconds, ease in cubic-bezier format [x1, y1, x2, y2]
// For use with framer-motion or Motion (the library).
// Note: tailwind-preset.ts defines the equivalent values for CSS transitions.

export const motion = {
  duration: { 
    fast: 0.12, 
    base: 0.2, 
    reveal: 0.4, 
    scene: 0.7 
  },
  reducedDuration: {
    fast: 0,
    base: 0,
    reveal: 0,
    scene: 0,
  },
  ease: {
    standard: [0.4, 0, 0.2, 1],
    verify: [0.34, 1.56, 0.64, 1],
  },
} as const
