'use client'

import { Card, Badge } from 'antd'
import { FolderOutlined, FileOutlined } from '@ant-design/icons'

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
        border: '0.5px solid #cfcfcf',
        borderRadius: 10,
        position: 'relative',
      }}
      styles={{
        body: {
          padding: cardVariant === 'image' ? 0 : 24,
          height: '100%',
        }
      }}
    >
        {cardVariant === 'folder' ? (
          // Folder/Phalak variant
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              {isPhalak ? (
                <FileOutlined
                  style={{
                    fontSize: 48,
                    color: '#1890ff',
                    marginBottom: 24,
                  }}
                />
              ) : (
                <FolderOutlined
                  style={{
                    fontSize: 48,
                    color: '#ffb4a2',
                    marginBottom: 24,
                  }}
                />
              )}
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: '#000000',
                  marginBottom: 8,
                }}
              >
                {name}
              </div>
              {description && (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    fontFamily: 'Inter, sans-serif',
                    color: '#666666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
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
                  bottom: 12,
                  right: 12,
                  background: '#ffb4a2',
                  color: '#000000',
                  borderRadius: 12,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {phalakCount}
              </div>
            )}
          </>
        ) : (
          // Image variant
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Cover Image */}
            <div
              style={{
                height: 192,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: 'hidden',
                background: coverImage ? `url(${coverImage})` : '#f0f0f0',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!coverImage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#d9d9d9',
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
                background: '#ffffff',
                borderTop: '0.5px solid #cfcfcf',
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                display: 'flex',
                alignItems: 'center',
                padding: '0 22px',
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  color: '#000000',
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
