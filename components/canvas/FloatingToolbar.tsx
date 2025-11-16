'use client'

import {
  FileTextOutlined,
  LinkOutlined,
  CheckSquareOutlined,
  LineOutlined,
  AppstoreOutlined,
  MoreOutlined,
  PictureOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { Tooltip, Divider } from 'antd'

interface FloatingToolbarProps {
  onAddCard?: (type: string) => void
}

export default function FloatingToolbar({ onAddCard }: FloatingToolbarProps) {
  const handleAddCard = (type: string) => {
    if (onAddCard) {
      onAddCard(type)
    }
  }

  const toolbarStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '10px 12px',
    zIndex: 1000,
    border: '1px solid rgba(0,0,0,0.04)'
  }

  const buttonStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    cursor: 'pointer',
    borderRadius: '6px',
    background: 'transparent',
    border: 'none',
    transition: 'all 0.15s ease',
    fontSize: '18px',
    color: '#666'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#999',
    marginTop: '2px',
    fontWeight: 500
  }

  const dividerStyle: React.CSSProperties = {
    height: '36px',
    margin: '0 6px',
    background: '#dee2e6',
    width: '1px'
  }

  const ToolButton = ({ icon, label, type, active = false }: {
    icon: React.ReactNode
    label: string
    type: string
    active?: boolean
  }) => (
    <Tooltip title={label} placement="bottom">
      <button
        style={{
          ...buttonStyle,
          background: active ? '#e3f2fd' : 'transparent'
        }}
        onClick={() => handleAddCard(type)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = active ? '#e3f2fd' : '#e9ecef'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = active ? '#e3f2fd' : 'transparent'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ fontSize: '17px', color: active ? '#1976d2' : '#495057' }}>
          {icon}
        </div>
        <div style={{ ...labelStyle, color: active ? '#1976d2' : '#6c757d' }}>
          {label}
        </div>
      </button>
    </Tooltip>
  )

  return (
    <div style={toolbarStyle}>
      <ToolButton icon={<FileTextOutlined />} label="Note" type="TEXT" />
      <ToolButton icon={<LinkOutlined />} label="Link" type="LINK" />
      <ToolButton icon={<CheckSquareOutlined />} label="To-do" type="TODO" />
      <ToolButton icon={<LineOutlined />} label="Line" type="LINE" />
      <ToolButton icon={<AppstoreOutlined />} label="Board" type="SUBBOARD" active />

      <Divider type="vertical" style={dividerStyle} />

      <ToolButton icon={<MoreOutlined />} label="More" type="MORE" />
      <ToolButton icon={<PictureOutlined />} label="Add image" type="IMAGE" />
      <ToolButton icon={<UploadOutlined />} label="Upload" type="UPLOAD" />
      <ToolButton icon={<EditOutlined />} label="Draw" type="DRAW" />
      <ToolButton icon={<DeleteOutlined />} label="Trash" type="TRASH" />
    </div>
  )
}
