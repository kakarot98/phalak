'use client'

import { Card } from 'antd'
import { FolderOutlined, FileOutlined } from '@ant-design/icons'
import { COLORS, TYPOGRAPHY, COMMON_STYLES, SPACING, RADIUS } from '@/theme'

interface ProjectCardProps {
  id: string
  name: string
  description?: string | null
  phalakCount?: number
  coverImage?: string | null
  type?: 'project' | 'folder' | 'phalak'
}

export default function ProjectCard({
  id,
  name,
  description,
  phalakCount = 0,
  coverImage,
  type = 'folder',
}: ProjectCardProps) {
  const cardVariant = coverImage ? 'image' : 'folder'
  const isPhalak = type === 'phalak'

  return (
    <Card
      hoverable
      variant="outlined"
      style={{
        width: 289,
        height: cardVariant === 'image' ? 272 : 192,
        border: `0.5px solid ${COLORS.border.medium}`,
        borderRadius: RADIUS.lg,
        position: 'relative',
      }}
      styles={{
        body: {
          padding: cardVariant === 'image' ? 0 : SPACING.lg,
          height: '100%',
        }
      }}
    >
        {cardVariant === 'folder' ? (
          // Folder/Phalak variant
          <>
            <div
              style={{
                ...COMMON_STYLES.flexColumn,
                alignItems: 'flex-start',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              {isPhalak ? (
                <FileOutlined
                  style={{
                    fontSize: 48,
                    color: COLORS.secondary,
                    marginBottom: SPACING.lg,
                  }}
                />
              ) : (
                <FolderOutlined
                  style={{
                    fontSize: 48,
                    color: COLORS.primary,
                    marginBottom: SPACING.lg,
                  }}
                />
              )}
              <div
                style={{
                  ...TYPOGRAPHY.label.large,
                  color: COLORS.text.primary,
                  marginBottom: SPACING.sm,
                }}
              >
                {name}
              </div>
              {description && (
                <div
                  style={{
                    ...TYPOGRAPHY.body.tiny,
                    color: COLORS.text.secondary,
                    ...COMMON_STYLES.truncateLines(2),
                  }}
                >
                  {description}
                </div>
              )}
            </div>

            {/* Phalak Count Badge */}
            {!isPhalak && phalakCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: SPACING.md - 4,
                  right: SPACING.md - 4,
                  background: COLORS.primary,
                  color: COLORS.text.primary,
                  borderRadius: RADIUS.full,
                  padding: '2px 8px',
                  ...TYPOGRAPHY.body.micro,
                }}
              >
                {phalakCount}
              </div>
            )}
          </>
        ) : (
          // Image variant
          <div style={{ height: '100%', ...COMMON_STYLES.flexColumn }}>
            {/* Cover Image */}
            <div
              style={{
                height: 192,
                borderTopLeftRadius: RADIUS.lg,
                borderTopRightRadius: RADIUS.lg,
                overflow: 'hidden',
                background: coverImage ? `url(${coverImage})` : COLORS.border.light,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!coverImage && (
                <div
                  style={{
                    ...COMMON_STYLES.flexCenter,
                    height: '100%',
                    color: COLORS.border.dark,
                  }}
                >
                  <FolderOutlined style={{ fontSize: 48 }} />
                </div>
              )}
            </div>
            {/* Footer */}
            <div
              style={{
                height: 80,
                background: COLORS.background.white,
                borderTop: `0.5px solid ${COLORS.border.medium}`,
                borderBottomLeftRadius: RADIUS.lg,
                borderBottomRightRadius: RADIUS.lg,
                display: 'flex',
                alignItems: 'center',
                padding: '0 22px',
              }}
            >
              <div
                style={{
                  ...TYPOGRAPHY.body.large,
                  fontWeight: 500,
                  color: COLORS.text.primary,
                }}
              >
                {name}
              </div>
            </div>
          </div>
        )}
      </Card>
  )
}
