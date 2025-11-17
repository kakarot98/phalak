"use client";

import { Layout } from "antd";
import { ReactNode } from "react";
import CanvasHeader from "./CanvasHeader";
import CanvasToolbar from "./CanvasToolbar";

const { Content } = Layout;

interface CanvasLayoutProps {
  children: ReactNode;
  boardName: string;
  boardColor?: string;
  onAddCard?: (type: string) => void;
}

export default function CanvasLayout({
  children,
  boardName,
  boardColor,
  onAddCard,
}: CanvasLayoutProps) {
  return (
    <Layout style={{ minHeight: "100vh", background: "#fffef6" }}>
      <CanvasHeader boardName={boardName} boardColor={boardColor} />
      <CanvasToolbar onAddCard={onAddCard} />
      <Content
        style={{
          position: "relative",
          minHeight: "calc(100vh - 95px)",
          background: "#fffef6",
          backgroundImage:
            "radial-gradient(circle, #d1d1d1 1px, transparent 1px)",
          backgroundSize: "9px 9px",
        }}
      >
        {/* Unsorted Button (top right) */}
        <div
          style={{
            position: "fixed",
            top: 115,
            right: 95,
            background: "#ebedee",
            borderRadius: 3,
            padding: "5px 12px",
            fontSize: 10.8,
            fontWeight: 700,
            color: "#666d7a",
            opacity: 0.5,
            fontFamily: "Inter, sans-serif",
            zIndex: 99,
          }}
        >
          0 <span style={{ fontWeight: 400 }}>Unsorted</span>
        </div>

        {children}
      </Content>
    </Layout>
  );
}
