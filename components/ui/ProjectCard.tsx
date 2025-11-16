'use client'

import { Card } from 'antd'
import { FolderOutlined } from '@ant-design/icons'
import Link from 'next/link'

interface ProjectCardProps {
  id: string
  name: string
  boardCount?: number
  coverImage?: string | null
  variant?: 'folder' | 'image'
}

export default function ProjectCard({
  id,
  name,
  boardCount = 0,
  coverImage,
  variant = 'folder',
}: ProjectCardProps) {
  const cardVariant = coverImage ? 'image' : variant

  return (
    <Link href={`/projects/${id}`} style={{ textDecoration: 'none' }}>
      <Card
        hoverable
        variant="outlined"
        style={{
          width: 289,
          height: cardVariant === 'image' ? 272 : 192,
          border: '0.5px solid #cfcfcf',
          borderRadius: 10,
        }}
        styles={{
          body: {
            padding: cardVariant === 'image' ? 0 : 24,
            height: '100%',
          }
        }}
      >
        {cardVariant === 'folder' ? (
          // Folder variant
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <FolderOutlined
              style={{
                fontSize: 48,
                color: '#ffb4a2',
                marginBottom: 24,
              }}
            />
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                color: '#000000',
                marginBottom: 8,
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 300,
                fontFamily: 'Inter, sans-serif',
                color: '#000000',
              }}
            >
              {boardCount} Boards
            </div>
          </div>
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
    </Link>
  )
}
