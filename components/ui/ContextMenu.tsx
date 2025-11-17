"use client";

import { Dropdown, MenuProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";
import { COLORS, TYPOGRAPHY } from "@/theme";

interface ContextMenuProps {
  children: ReactNode;
  onDelete?: () => void;
  onRename?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  disabled?: boolean;
}

export default function ContextMenu({
  children,
  onDelete,
  onRename,
  onCopy,
  onCut,
  onPaste,
  disabled = false,
}: ContextMenuProps) {
  const menuItems: MenuProps["items"] = [
    {
      key: "rename",
      label: "Rename",
      icon: <EditOutlined />,
      onClick: onRename,
    },
    {
      key: "copy",
      label: "Copy",
      icon: <CopyOutlined />,
      onClick: onCopy,
    },
    {
      key: "cut",
      label: "Cut",
      icon: <ScissorOutlined />,
      onClick: onCut,
    },
    {
      key: "paste",
      label: "Paste",
      icon: <SnippetsOutlined />,
      onClick: onPaste,
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{
        items: menuItems,
        style: {
          background: COLORS.background.white,
          border: `1px solid ${COLORS.border.light}`,
          borderRadius: 8,
          padding: "4px 0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        },
      }}
      trigger={["contextMenu"]}
      disabled={disabled}
    >
      {children}
    </Dropdown>
  );
}
