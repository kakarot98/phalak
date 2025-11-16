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
      prefix={<SearchOutlined style={{ color: '#ffffff', fontSize: 20 }} />}
      placeholder={placeholder}
      size="large"
      style={{
        width: '100%',
        maxWidth: 906,
        height: 44,
        background: '#cfcfcf',
        border: 'none',
        borderRadius: 11,
        fontSize: 21,
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
