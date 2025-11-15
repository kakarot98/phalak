'use client'

import { Layout, Menu } from 'antd'
import { FolderOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { ReactNode } from 'react'

const { Header, Content } = Layout

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold', marginRight: '40px' }}>
          Phalakam
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['workspaces']}
          style={{ flex: 1, minWidth: 0 }}
          items={[
            {
              key: 'workspaces',
              icon: <FolderOutlined />,
              label: <Link href="/">Workspaces</Link>,
            },
          ]}
        />
      </Header>
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        {children}
      </Content>
    </Layout>
  )
}
