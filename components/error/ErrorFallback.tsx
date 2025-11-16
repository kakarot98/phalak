'use client'

import { Button } from 'antd'
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons'

interface ErrorFallbackProps {
  error: Error | null
  onReset?: () => void
  fullScreen?: boolean
}

export default function ErrorFallback({
  error,
  onReset,
  fullScreen = false
}: ErrorFallbackProps) {
  const containerStyle = fullScreen
    ? {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f7f7f7',
        padding: '48px',
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        background: '#f7f7f7',
        borderRadius: 10,
      }

  const handleReload = () => {
    if (onReset) {
      onReset()
    } else {
      // If no reset handler provided, reload the page
      window.location.reload()
    }
  }

  return (
    <div style={containerStyle}>
      <ExclamationCircleOutlined
        style={{
          fontSize: 64,
          color: '#ff4d4f',
          marginBottom: 24,
        }}
      />
      <h2
        style={{
          fontSize: 24,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          color: '#000000',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontSize: 14,
          fontWeight: 300,
          fontFamily: 'Inter, sans-serif',
          color: '#666666',
          marginBottom: 24,
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        onClick={handleReload}
        style={{
          height: 40,
          fontSize: 14,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Try Again
      </Button>
      {process.env.NODE_ENV === 'development' && error?.stack && (
        <details
          style={{
            marginTop: 24,
            padding: 16,
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #f0f0f0',
            maxWidth: 600,
            width: '100%',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#666666',
            }}
          >
            Error Details (Development Only)
          </summary>
          <pre
            style={{
              marginTop: 12,
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#ff4d4f',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}
