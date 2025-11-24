"use client";

import { useState } from "react";
import { Tooltip } from "antd";
import { useDraggable } from "@dnd-kit/core";
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

interface DraggableToolButtonProps {
  icon: React.ReactNode;
  label: string;
  type: string;
  active?: boolean;
  draggable?: boolean;
}

function DraggableToolButton({
  icon,
  label,
  type,
  active = false,
  draggable = true,
}: DraggableToolButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbar-${type}`,
    data: {
      type: "toolbar-item",
      cardType: type,
    },
    disabled: !draggable,
  });

  return (
    <Tooltip
      title={draggable ? `Drag to create ${label}` : label}
      placement="bottom"
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: draggable ? "grab" : "pointer",
          padding: "6px 8.75px",
          borderRadius: 3,
          background: active
            ? "#ebedee"
            : isHovered
              ? "#f0f0f0"
              : "transparent",
          transform:
            isHovered && !isDragging ? "translateY(-1px)" : "translateY(0)",
          transition: "all 0.15s ease",
          opacity: isDragging ? 0.5 : 1,
          touchAction: "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            fontSize: 24,
            color: "#323b4a",
            marginBottom: 4,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 9,
            color: "#323b4a",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {label}
        </span>
      </div>
    </Tooltip>
  );
}

// Non-draggable tool button for items that don't create cards
interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

function ToolButton({ icon, label, onClick, active = false }: ToolButtonProps) {
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
            color: "#323b4a",
            marginBottom: 4,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 9,
            color: "#323b4a",
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
      {/* Draggable card-creating tools */}
      <DraggableToolButton
        icon={<FileTextOutlined />}
        label="Note"
        type="TEXT"
      />
      <DraggableToolButton icon={<LinkOutlined />} label="Link" type="LINK" />
      <DraggableToolButton
        icon={<CheckSquareOutlined />}
        label="To-do"
        type="TODO"
        draggable={false}
      />
      <DraggableToolButton
        icon={<LineOutlined />}
        label="Line"
        type="LINE"
        draggable={false}
      />
      <DraggableToolButton
        icon={<AppstoreOutlined />}
        label="Board"
        type="SUBBOARD"
        active
        draggable={false}
      />

      <div
        style={{
          width: 3,
          height: 40,
          background: "rgba(0, 0, 0, 0.1)",
          margin: "0 4px",
        }}
      />

      <DraggableToolButton
        icon={<PictureOutlined />}
        label="Add image"
        type="IMAGE"
        draggable={false}
      />
      <ToolButton icon={<UploadOutlined />} label="Upload" />
      <ToolButton icon={<EditOutlined />} label="Draw" />
      <ToolButton icon={<DeleteOutlined />} label="Trash" />
    </div>
  );
}
