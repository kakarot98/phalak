'use client'

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingState({
  message = 'Loading...',
  fullScreen = false
}: LoadingStateProps) {
  const containerStyle = fullScreen
    ? {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f7f7f7',
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        background: '#f7f7f7',
        minHeight: '400px',
      }

  return (
    <div style={containerStyle}>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 32, color: '#ffb4a2' }} spin />}
        size="large"
      />
      <div
        style={{
          marginTop: 16,
          fontSize: 14,
          fontWeight: 300,
          fontFamily: 'Inter, sans-serif',
          color: '#666666',
        }}
      >
        {message}
      </div>
    </div>
  )
}
