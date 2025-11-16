'use client'

import { Layout } from 'antd'
import { ReactNode } from 'react'
import DarkHeader from './DarkHeader'
import Sidebar from './Sidebar'

const { Content } = Layout

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DarkHeader />
      <Layout>
        <Sidebar />
        <Content
          style={{
            padding: '48px 52px',
            background: '#f7f7f7',
            minHeight: 'calc(100vh - 170px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
