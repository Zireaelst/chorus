// Motion tokens — DESIGN_SYSTEM.md section "Motion tokens"
// Used by all animated components in packages/ui and apps/*.
// Import: import { motion } from '@chorus/ui'
//
// DESIGN_SYSTEM.md: "treat every animation as communicating a state change.
// Don't add decorative motion — parallax, hover-scale on cards, bouncing icons —
// that doesn't correspond to a real state change."

export const motion = {
  duration: {
    fast: 0.12, // --dur-fast: hover, focus, button press
    base: 0.2, // --dur-base: standard transitions, dropdown open
    reveal: 0.4, // --dur-reveal: redaction reveal/conceal (the brand's signature interaction)
    scene: 0.7, // --dur-scene: scroll-driven scene steps — marketing site only
  },
  ease: {
    // Standard ease-out — used for all transitions except verify
    standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
    // Custom overshoot — exclusively for the amber verification pulse.
    // DESIGN_SYSTEM.md: "should feel like a stamp landing, not a UI element settling."
    verify: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
} as const

export type MotionDuration = keyof typeof motion.duration
export type MotionEase = keyof typeof motion.ease
