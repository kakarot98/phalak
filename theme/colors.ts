/**
 * Color palette for the Phalakam application
 * Extracted from repeated inline styles across components
 */

export const COLORS = {
  // Brand colors
  primary: '#ffb4a2',      // Coral/salmon - main brand color
  secondary: '#1890ff',    // Blue - used for phalak icons and accents

  // Background colors
  background: {
    main: '#f7f7f7',       // Light gray - main background
    dark: '#1a1a1a',       // Dark header background
    white: '#ffffff',      // White backgrounds
    canvas: '#f7f5f2',     // Canvas background
  },

  // Text colors
  text: {
    primary: '#000000',    // Black - headings and primary text
    secondary: '#666666',  // Medium gray - secondary text
    tertiary: '#999999',   // Light gray - tertiary text
    white: '#ffffff',      // White text on dark backgrounds
    muted: '#8d929a',      // Muted gray for disabled/inactive
  },

  // Border colors
  border: {
    light: '#f0f0f0',      // Very light border
    medium: '#cfcfcf',     // Medium border
    dark: '#d9d9d9',       // Darker border
  },

  // State colors
  error: '#ff4d4f',        // Error/danger red
  success: '#52c41a',      // Success green
  warning: '#faad14',      // Warning orange
  info: '#1890ff',         // Info blue
} as const

// Type for color keys - enables autocomplete
export type Color = typeof COLORS
