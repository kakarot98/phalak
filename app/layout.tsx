import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import theme from "@/theme/themeConfig";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nivita",
  description: "Lightweight visual workspace for creative projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
