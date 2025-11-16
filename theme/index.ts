/**
 * Theme barrel export
 * Simplifies imports across the application
 */

export { COLORS } from './colors'
export type { Color } from './colors'

export { TYPOGRAPHY, getFontFamily } from './typography'
export type { Typography } from './typography'

export { COMMON_STYLES, COMPONENT_STYLES, SPACING, RADIUS } from './styles'
export type { Spacing, Radius } from './styles'

// Re-export themeConfig for Ant Design
export { default as themeConfig } from './themeConfig'
