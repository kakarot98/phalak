import type { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#ffb4a2',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f7f7f7',
    borderRadius: 10,
    borderRadiusLG: 12,
    fontSize: 14,
    controlHeight: 40,
  },
  components: {
    Layout: {
      headerBg: '#1a1a1a',
      headerHeight: 120,
      bodyBg: '#f7f7f7',
      siderBg: '#ffffff',
    },
    Card: {
      borderRadiusLG: 10,
    },
    Button: {
      controlHeight: 40,
    },
    Input: {
      borderRadius: 11,
    },
  },
}

export default theme
