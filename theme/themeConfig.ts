import type { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    borderRadius: 8,
    borderRadiusLG: 12,
    fontSize: 14,
    controlHeight: 40,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      bodyBg: '#f5f5f5',
    },
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      controlHeight: 40,
    },
  },
}

export default theme
