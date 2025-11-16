'use client'

import { Button, Space } from 'antd'
import {
  FileTextOutlined,
  LinkOutlined,
  CheckSquareOutlined,
  LineOutlined,
  AppstoreOutlined,
  PictureOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

interface ToolButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  active?: boolean
}

function ToolButton({ icon, label, onClick, active = false }: ToolButtonProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '6px 8.75px',
        borderRadius: 3,
        background: active ? '#ebedee' : 'transparent',
      }}
      onClick={onClick}
    >
      <div style={{ fontSize: 24, color: active ? '#323b4a' : '#8d929a', marginBottom: 4 }}>
        {icon}
      </div>
      <span
        style={{
          fontSize: 9,
          color: 'rgba(2, 12, 31, 0.6)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default function CanvasToolbar() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 118,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#ebedee',
        borderRadius: 9,
        padding: '6px 8px',
        boxShadow: '0px 4px 11.2px rgba(0, 0, 0, 0.14)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 100,
      }}
    >
      <ToolButton icon={<FileTextOutlined />} label="Note" />
      <ToolButton icon={<LinkOutlined />} label="Link" />
      <ToolButton icon={<CheckSquareOutlined />} label="To-do" />
      <ToolButton icon={<LineOutlined />} label="Line" />
      <ToolButton icon={<AppstoreOutlined />} label="Board" active />
      <ToolButton icon={<PictureOutlined />} label="Add image" />
      <ToolButton icon={<UploadOutlined />} label="Upload" />
      <ToolButton icon={<EditOutlined />} label="Draw" />

      <div
        style={{
          width: 1,
          height: 40,
          background: 'rgba(0, 0, 0, 0.1)',
          margin: '0 4px',
        }}
      />

      <ToolButton icon={<DeleteOutlined />} label="Trash" />
    </div>
  )
}
