'use client'

import { Layout, Dropdown, Button, Space } from 'antd'
import {
  HomeOutlined,
  UndoOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  ShareAltOutlined,
  ExportOutlined,
  DownOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import type { MenuProps } from 'antd'

const { Header } = Layout

interface CanvasHeaderProps {
  boardName: string
  boardColor?: string
}

export default function CanvasHeader({ boardName, boardColor = '#db9db7' }: CanvasHeaderProps) {
  const shareMenu: MenuProps['items'] = [
    { key: 'copy-link', label: 'Copy Link' },
    { key: 'email', label: 'Email' },
  ]

  const exportMenu: MenuProps['items'] = [
    { key: 'pdf', label: 'Export as PDF' },
    { key: 'image', label: 'Export as Image' },
  ]

  const viewMenu: MenuProps['items'] = [
    { key: '100', label: '100%' },
    { key: '75', label: '75%' },
    { key: '50', label: '50%' },
  ]

  return (
    <Header
      style={{
        background: '#ffffff',
        height: 95,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      {/* Left: Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HomeOutlined style={{ fontSize: 18, color: '#323b4a' }} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#323b4a',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Home
          </span>
        </Link>
        <span style={{ color: '#cbced2', fontSize: 12 }}>/</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: boardColor,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#8d929a',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {boardName}
          </span>
        </div>
      </div>

      {/* Center: Board Name */}
      <div
        style={{
          fontSize: 19.8,
          fontWeight: 600,
          color: '#323b4a',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {boardName}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            fontSize: 12,
            color: '#f4511c',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
          }}
        >
          Refer a friend, get more space &gt;
        </span>

        <Space size="middle">
          <UndoOutlined style={{ fontSize: 18, color: '#8d929a', cursor: 'pointer' }} />
          <BellOutlined style={{ fontSize: 18, color: '#8d929a', cursor: 'pointer' }} />
          <QuestionCircleOutlined style={{ fontSize: 18, color: '#8d929a', cursor: 'pointer' }} />
          <SettingOutlined style={{ fontSize: 18, color: '#8d929a', cursor: 'pointer' }} />
        </Space>

        <Dropdown menu={{ items: shareMenu }} trigger={['click']}>
          <Button
            type="text"
            size="small"
            style={{
              fontSize: 10.8,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#323b4a',
            }}
          >
            <ShareAltOutlined /> Share
          </Button>
        </Dropdown>

        <Dropdown menu={{ items: exportMenu }} trigger={['click']}>
          <Button
            type="text"
            size="small"
            style={{
              fontSize: 10.8,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#323b4a',
            }}
          >
            Export <DownOutlined style={{ fontSize: 10 }} />
          </Button>
        </Dropdown>

        <Dropdown menu={{ items: viewMenu }} trigger={['click']}>
          <Button
            type="text"
            size="small"
            style={{
              fontSize: 10.8,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#323b4a',
            }}
          >
            View <DownOutlined style={{ fontSize: 10 }} />
          </Button>
        </Dropdown>
      </div>
    </Header>
  )
}
