"use client";

import { Card } from "antd";
import { parseCardContent } from "@/types/card";
import type { TextCardContent } from "@/types/card";
import { KeyboardEvent } from "react";

interface TextCardProps {
  title?: string | null;
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

export default function TextCard({
  title,
  content,
  color,
  isEditing = false,
  editingContent = "",
  onEditingContentChange,
  onEditSave,
  onEditCancel,
  onStartEdit,
}: TextCardProps) {
  // Parse the JSON content
  const cardContent = content
    ? parseCardContent<TextCardContent>({ content } as any)
    : null;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // Enter to save
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

  return (
    <Card
      variant="borderless"
      style={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        borderRadius: "6px",
        background: "white",
        borderTop: color ? `4px solid ${color}` : "none",
        userSelect: isEditing ? "text" : "none", // Allow text selection when editing
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
      {title && (
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "8px",
            color: "#333",
          }}
        >
          {title}
        </div>
      )}

      {cardContent?.richText && (
        <div
          style={{
            fontSize: "13px",
            lineHeight: "1.6",
            color: "#666",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {isEditing ? (
            <textarea
              value={editingContent}
              onChange={(e) => onEditingContentChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onClick={handleInputClick}
              autoFocus
              style={{
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#666",
                padding: 0,
                margin: 0,
                border: "none",
                borderRadius: 0,
                outline: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
                resize: "none",
                width: "100%",
                minHeight: "100%",
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            />
          ) : (
            cardContent.richText
          )}
        </div>
      )}

      {cardContent?.source && (
        <div
          style={{
            fontSize: "11px",
            color: "#999",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          Source: {cardContent.source}
        </div>
      )}
    </Card>
  );
}
