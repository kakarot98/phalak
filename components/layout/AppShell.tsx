'use client'

import { Layout, Breadcrumb, Button, Space } from 'antd'
import { ReactNode } from 'react'
import DarkHeader from './DarkHeader'
import Sidebar from './Sidebar'
import SearchBar from '../ui/SearchBar'

const { Content } = Layout

export interface BreadcrumbItem {
  title: ReactNode
  href?: string
}

interface AppShellProps {
  children: ReactNode
  heading?: string
  breadcrumbs?: BreadcrumbItem[]
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
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Search Bar */}
            {showSearch && <SearchBar />}

            {/* Heading and Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: breadcrumbs ? 0 : 24,
              }}
            >
              <div>
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <Breadcrumb
                    items={breadcrumbs}
                    style={{
                      marginBottom: 12,
                      fontSize: 13,
                    }}
                  />
                )}

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
              </div>

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

            {/* Content */}
            {children}
          </Space>
        </Content>
      </Layout>
    </Layout>
  )
}
