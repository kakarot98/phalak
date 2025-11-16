import { CSSProperties } from 'react'
import { COLORS } from './colors'
import { TYPOGRAPHY } from './typography'

/**
 * Reusable style objects for common UI patterns
 * Reduces inline style duplication
 */

export const COMMON_STYLES = {
  // Flex layouts
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as CSSProperties,

  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,

  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as CSSProperties,

  // Text truncation
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as CSSProperties,

  truncateLines: (lines: number) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
  } as CSSProperties),

  // Full screen container
  fullScreen: {
    width: '100vw',
    height: '100vh',
  } as CSSProperties,
} as const

export const COMPONENT_STYLES = {
  // Button styles
  button: {
    default: {
      border: `0.5px solid ${COLORS.border.medium}`,
      borderRadius: 4,
      fontSize: 14,
      fontWeight: 300,
      fontFamily: TYPOGRAPHY.body.small.fontFamily,
      height: 32,
    } as CSSProperties,

    compact: {
      height: 24,
      fontSize: 12,
      padding: '0 8px',
    } as CSSProperties,
  },

  // Card styles
  card: {
    default: {
      border: `0.5px solid ${COLORS.border.medium}`,
      borderRadius: 10,
    } as CSSProperties,

    hoverable: {
      border: `0.5px solid ${COLORS.border.medium}`,
      borderRadius: 10,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as CSSProperties,
  },

  // Badge styles
  badge: {
    default: {
      background: COLORS.primary,
      color: COLORS.text.primary,
      borderRadius: 12,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: TYPOGRAPHY.body.micro.fontFamily,
    } as CSSProperties,
  },

  // Input styles
  input: {
    default: {
      borderRadius: 11,
    } as CSSProperties,
  },

  // Modal styles
  modal: {
    footer: {
      display: 'flex',
      gap: '8px',
    } as CSSProperties,
  },
} as const

// Spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

// Border radius scale
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  full: 9999,
} as const

// Type exports
export type Spacing = typeof SPACING
export type Radius = typeof RADIUS
