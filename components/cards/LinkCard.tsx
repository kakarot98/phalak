"use client";

import { Card, Input } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { parseCardContent } from "@/types/card";
import type { LinkCardContent } from "@/types/card";
import { KeyboardEvent } from "react";

interface LinkCardProps {
  content?: string | null;
  color?: string | null;
  // Inline editing props
  isEditing?: boolean;
  editingContent?: string;
  onEditingContentChange?: (content: string) => void;
  onEditSave?: () => void;
  onEditCancel?: () => void;
  onStartEdit?: () => void;
}

export default function LinkCard({
  content,
  color,
  isEditing = false,
  editingContent = "",
  onEditingContentChange,
  onEditSave,
  onEditCancel,
  onStartEdit,
}: LinkCardProps) {
  // Parse the JSON content
  const linkContent = content
    ? parseCardContent<LinkCardContent>({ content } as any)
    : null;

  if (!linkContent?.url && !isEditing) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEditSave?.();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onEditCancel?.();
    }
  };

  const handleBlur = () => {
    // Save on blur (click outside)
    onEditSave?.();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.stopPropagation();
      onStartEdit?.();
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    // Prevent event propagation when clicking input
    e.stopPropagation();
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card drag when clicking link
    if (!isEditing && linkContent?.url) {
      window.open(linkContent.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      variant="borderless"
      style={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        borderRadius: "6px",
        background: "white",
        borderTop: color ? `4px solid ${color}` : "none",
        userSelect: isEditing ? "text" : "none",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        cursor: isEditing ? "text" : "pointer",
      }}
      styles={{
        body: {
          padding: "18px",
        },
      }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={(e) => {
        if (!isEditing) {
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isEditing) {
          e.currentTarget.style.boxShadow =
            "0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <LinkOutlined
          style={{
            fontSize: "16px",
            color: "#1890ff",
            flexShrink: 0,
          }}
        />
        {isEditing ? (
          <Input
            value={editingContent}
            onChange={(e) => onEditingContentChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onClick={handleInputClick}
            autoFocus
            placeholder="https://example.com"
            // prefix={<LinkOutlined style={{ color: "#1890ff" }} />}
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              flex: 1,
            }}
          />
        ) : (
          <a
            href={linkContent?.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#1890ff",
              textDecoration: "underline",
              wordBreak: "break-all",
              cursor: "pointer",
            }}
          >
            {linkContent?.url}
          </a>
        )}
      </div>
    </Card>
  );
}
