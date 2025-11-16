'use client'

import { Card } from 'antd'
import { parseCardContent } from '@/types/card'
import type { TextCardContent } from '@/types/card'

interface TextCardProps {
  title?: string | null
  content?: string | null
  color?: string | null
}

export default function TextCard({ title, content, color }: TextCardProps) {
  // Parse the JSON content
  const cardContent = content ? parseCardContent<TextCardContent>({ content } as any) : null

  return (
    <Card
      variant="borderless"
      style={{
        boxShadow: '0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        borderRadius: '6px',
        background: 'white',
        borderTop: color ? `4px solid ${color}` : 'none',
        userSelect: 'none', // Prevent text selection while dragging
        transition: 'box-shadow 0.2s ease, transform 0.2s ease'
      }}
      styles={{
        body: {
          padding: '18px'
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {title && (
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '8px',
          color: '#333'
        }}>
          {title}
        </div>
      )}

      {cardContent?.richText && (
        <div style={{
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#666',
          whiteSpace: 'pre-wrap'
        }}>
          {cardContent.richText}
        </div>
      )}

      {cardContent?.source && (
        <div style={{
          fontSize: '11px',
          color: '#999',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0'
        }}>
          Source: {cardContent.source}
        </div>
      )}
    </Card>
  )
}
