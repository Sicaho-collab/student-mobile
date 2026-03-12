/**
 * Material 3 color tokens for React Native
 *
 * Source of truth: alumable-design-system/packages/design-tokens
 * Keep in sync when tokens change via /propagate-component
 */

export const colors = {
  // Primary
  primary: '#9A76BE',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',

  // Secondary
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',

  // Tertiary
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',

  // Error
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',

  // Surface
  surface: '#FFFFFF',
  surfaceDim: '#D9D9D9',
  surfaceBright: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F7F7F7',
  surfaceContainer: '#F1F1F1',
  surfaceContainerHigh: '#EBEBEB',
  surfaceContainerHighest: '#E3E3E3',
  onSurface: '#1D1B20',
  onSurfaceVariant: '#49454F',
  outline: '#7A7A7A',
  outlineVariant: '#C9C9C9',
  inverseSurface: '#313131',
  inverseOnSurface: '#F4F4F4',
  inversePrimary: '#D0BCFF',
  scrim: '#000000',
  shadow: '#000000',
} as const

export const fontFamily = "'Instrument Sans', system-ui, -apple-system, sans-serif"

export const fontSize = {
  title: 20,
  subtitle: 16,
  body: 14,
  caption: 12,
  small: 11,
} as const

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
} as const
