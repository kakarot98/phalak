'use client'

import { Layout, Menu } from 'antd'
import {
  HomeOutlined,
  AppstoreOutlined,
  LayoutOutlined,
  FileOutlined,
  ClockCircleOutlined,
  StarOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import type { MenuProps } from 'antd'

const { Sider } = Layout

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/projects',
      icon: <AppstoreOutlined />,
      label: 'All Projects',
    },
    {
      key: '/boards',
      icon: <LayoutOutlined />,
      label: 'All Boards',
    },
    {
      key: '/templates',
      icon: <FileOutlined />,
      label: 'Templates',
    },
    {
      key: '/recents',
      icon: <ClockCircleOutlined />,
      label: 'Recents',
    },
    {
      key: '/favourites',
      icon: <StarOutlined />,
      label: 'Favourites',
    },
    {
      key: '/trash',
      icon: <DeleteOutlined />,
      label: 'Trash',
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    router.push(e.key)
  }

  return (
    <Sider
      width={399}
      style={{
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
      }}
      breakpoint="md"
      collapsedWidth={0}
    >
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        style={{
          marginTop: 44,
          border: 'none',
          fontSize: 24,
          fontFamily: 'Inter, sans-serif',
        }}
        items={menuItems}
      />
    </Sider>
  )
}
