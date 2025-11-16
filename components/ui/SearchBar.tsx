'use client'

import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (value: string) => void
}

export default function SearchBar({
  placeholder = 'Search boards, projects...',
  onSearch,
}: SearchBarProps) {
  return (
    <Input
      prefix={<SearchOutlined style={{ color: '#ffffff', fontSize: 14 }} />}
      placeholder={placeholder}
      size="middle"
      style={{
        width: '100%',
        maxWidth: 600,
        height: 36,
        background: '#cfcfcf',
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'Inter, sans-serif',
        color: '#000000',
      }}
      classNames={{
        input: 'search-bar-input'
      }}
      onPressEnter={(e) => onSearch?.(e.currentTarget.value)}
    />
  )
}
