'use client'

import { Layout, Breadcrumb, Button, Space } from 'antd'
import type { BreadcrumbProps } from 'antd'
import { ReactNode } from 'react'
import DarkHeader from './DarkHeader'
import Sidebar from './Sidebar'
import SearchBar from '../ui/SearchBar'

const { Content } = Layout

interface AppShellProps {
  children: ReactNode
  heading?: string
  breadcrumbs?: BreadcrumbProps['items']
  actions?: {
    label: string
    icon?: ReactNode
    onClick: () => void
    type?: 'default' | 'primary'
  }[]
  showSearch?: boolean
}

export default function AppShell({
  children,
  heading = 'Your Workspace',
  breadcrumbs,
  actions,
  showSearch = true
}: AppShellProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DarkHeader />
      <Layout>
        <Sidebar />
        <Content
          style={{
            padding: '32px 40px',
            background: '#f7f7f7',
            minHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Space
            direction="vertical"
            size="large"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1
            }}
          >
            {/* Search Bar */}
            {showSearch && <SearchBar />}

            {/* Heading and Actions Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 24,
              }}
            >
              {/* Heading */}
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  margin: 0,
                }}
              >
                {heading}
              </h1>

              {/* Action Buttons */}
              {actions && actions.length > 0 && (
                <Space size="middle">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      type={action.type}
                      icon={action.icon}
                      onClick={action.onClick}
                      style={{
                        border: action.type === 'default' ? '0.5px solid #cfcfcf' : undefined,
                        borderRadius: 4,
                        fontSize: 14,
                        fontWeight: 300,
                        fontFamily: 'Inter, sans-serif',
                        height: 32,
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Space>
              )}
            </div>

            {/* Breadcrumbs - Below heading/actions */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb
                items={breadcrumbs}
                style={{
                  marginTop: 12,
                  fontSize: 13,
                }}
              />
            )}

            {/* Content */}
            {children}
          </Space>
        </Content>
      </Layout>
    </Layout>
  )
}
