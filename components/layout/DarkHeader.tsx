'use client'

import { Layout, Avatar, Dropdown, Badge } from 'antd'
import { SearchOutlined, BellOutlined, SettingOutlined, DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header } = Layout

export default function DarkHeader() {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'settings',
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ]

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        background: '#1a1a1a',
        height: 120,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
          color: '#ffb4a2',
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase'
        }}
      >
        Nivita
      </div>

      {/* Right Section: Icons + User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Search Icon */}
        <SearchOutlined
          style={{
            fontSize: 20,
            color: '#ffffff',
            cursor: 'pointer',
          }}
        />

        {/* Notifications */}
        <Badge count={0} showZero={false}>
          <BellOutlined
            style={{
              fontSize: 20,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          />
        </Badge>

        {/* Settings */}
        <SettingOutlined
          style={{
            fontSize: 20,
            color: '#ffffff',
            cursor: 'pointer',
          }}
        />

        {/* User Profile Dropdown */}
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <Avatar
              size={24}
              style={{
                backgroundColor: '#ffb4a2',
                color: '#000000',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              H
            </Avatar>
            <span
              style={{
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              hrushikesh
            </span>
            <DownOutlined style={{ fontSize: 12, color: '#ffffff' }} />
          </div>
        </Dropdown>
      </div>
    </Header>
  )
}
