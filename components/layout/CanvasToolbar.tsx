"use client";

import { useState } from "react";
import { Tooltip } from "antd";
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
} from "@ant-design/icons";

interface CanvasToolbarProps {
  onAddCard?: (type: string) => void;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  type: string;
  onClick?: () => void;
  active?: boolean;
}

function ToolButton({
  icon,
  label,
  type,
  onClick,
  active = false,
}: ToolButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip title={label} placement="bottom">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: "6px 8.75px",
          borderRadius: 3,
          background: active
            ? "#ebedee"
            : isHovered
              ? "#f0f0f0"
              : "transparent",
          transform: isHovered ? "translateY(-1px)" : "translateY(0)",
          transition: "all 0.15s ease",
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            fontSize: 24,
            color: active ? "#323b4a" : "#8d929a",
            marginBottom: 4,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 9,
            color: "rgba(2, 12, 31, 0.6)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {label}
        </span>
      </div>
    </Tooltip>
  );
}

export default function CanvasToolbar({ onAddCard }: CanvasToolbarProps) {
  const handleAddCard = (type: string) => {
    if (onAddCard) {
      onAddCard(type);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 118,
        left: 20,
        background: "#ebedee",
        borderRadius: 9,
        padding: "6px 8px",
        boxShadow: "0px 4px 11.2px rgba(0, 0, 0, 0.14)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        zIndex: 1000,
      }}
    >
      <ToolButton
        icon={<FileTextOutlined />}
        label="Note"
        type="TEXT"
        onClick={() => handleAddCard("TEXT")}
      />
      <ToolButton
        icon={<LinkOutlined />}
        label="Link"
        type="LINK"
        onClick={() => handleAddCard("LINK")}
      />
      <ToolButton
        icon={<CheckSquareOutlined />}
        label="To-do"
        type="TODO"
        onClick={() => handleAddCard("TODO")}
      />
      <ToolButton
        icon={<LineOutlined />}
        label="Line"
        type="LINE"
        onClick={() => handleAddCard("LINE")}
      />
      <ToolButton
        icon={<AppstoreOutlined />}
        label="Board"
        type="SUBBOARD"
        onClick={() => handleAddCard("SUBBOARD")}
        active
      />
      <ToolButton
        icon={<PictureOutlined />}
        label="Add image"
        type="IMAGE"
        onClick={() => handleAddCard("IMAGE")}
      />
      <ToolButton
        icon={<UploadOutlined />}
        label="Upload"
        type="UPLOAD"
        onClick={() => handleAddCard("UPLOAD")}
      />
      <ToolButton
        icon={<EditOutlined />}
        label="Draw"
        type="DRAW"
        onClick={() => handleAddCard("DRAW")}
      />

      <div
        style={{
          width: 1,
          height: 40,
          background: "rgba(0, 0, 0, 0.1)",
          margin: "0 4px",
        }}
      />

      <ToolButton
        icon={<DeleteOutlined />}
        label="Trash"
        type="TRASH"
        onClick={() => handleAddCard("TRASH")}
      />
    </div>
  );
}
