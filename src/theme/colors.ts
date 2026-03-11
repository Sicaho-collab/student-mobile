/**
 * Material 3 color tokens for React Native
 *
 * CENTRALIZED: These values come from m3-design-system.
 * When the design system is installed as a dependency, replace this file with:
 *
 *   import { m3Colors, m3Radius } from 'm3-design-system'
 *   export const colors = m3Colors
 *   export const borderRadius = m3Radius
 *
 * Until then, keep these in sync with m3-design-system/src/tokens.ts
 */
import { m3Colors, m3Radius } from 'm3-design-system'

export const colors = m3Colors

export const fontSize = {
  title: 20,
  subtitle: 16,
  body: 14,
  caption: 12,
  small: 11,
} as const

export const borderRadius = m3Radius
