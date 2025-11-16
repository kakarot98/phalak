/**
 * Typography system for the Phalakam application
 * Consolidates repeated font styles across components
 */

const FONT_FAMILY = 'Inter, sans-serif' as const

export const TYPOGRAPHY = {
  // Headings
  heading: {
    h1: {
      fontSize: 32,
      fontWeight: 600,
      fontFamily: FONT_FAMILY,
    },
    h2: {
      fontSize: 28,
      fontWeight: 600,
      fontFamily: FONT_FAMILY,
    },
    h3: {
      fontSize: 24,
      fontWeight: 600,
      fontFamily: FONT_FAMILY,
    },
    h4: {
      fontSize: 20,
      fontWeight: 600,
      fontFamily: FONT_FAMILY,
    },
  },

  // Body text
  body: {
    large: {
      fontSize: 18,
      fontWeight: 400,
      fontFamily: FONT_FAMILY,
    },
    regular: {
      fontSize: 16,
      fontWeight: 400,
      fontFamily: FONT_FAMILY,
    },
    small: {
      fontSize: 14,
      fontWeight: 300,
      fontFamily: FONT_FAMILY,
    },
    tiny: {
      fontSize: 13,
      fontWeight: 300,
      fontFamily: FONT_FAMILY,
    },
    micro: {
      fontSize: 11,
      fontWeight: 600,
      fontFamily: FONT_FAMILY,
    },
  },

  // Labels (medium weight)
  label: {
    large: {
      fontSize: 16,
      fontWeight: 500,
      fontFamily: FONT_FAMILY,
    },
    regular: {
      fontSize: 14,
      fontWeight: 500,
      fontFamily: FONT_FAMILY,
    },
    small: {
      fontSize: 13,
      fontWeight: 500,
      fontFamily: FONT_FAMILY,
    },
  },

  // Special text styles
  caption: {
    fontSize: 12,
    fontWeight: 300,
    fontFamily: FONT_FAMILY,
  },

  code: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: 'monospace',
  },
} as const

// Type for typography keys
export type Typography = typeof TYPOGRAPHY

// Helper to get font family
export const getFontFamily = () => FONT_FAMILY
