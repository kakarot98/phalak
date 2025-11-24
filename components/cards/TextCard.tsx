"use client";

import { Card } from "antd";
import { parseCardContent } from "@/types/card";
import type { TextCardContent } from "@/types/card";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

interface TextCardProps {
  title?: string | null;
  content?: string | null;
  color?: string | null;
  // Inline editing props
  isEditing?: boolean;
  onEditSave?: (content: string) => void;
  onEditCancel?: (content: string) => void;
  onStartEdit?: () => void;
}

export default function TextCard({
  title,
  content,
  color,
  isEditing = false,
  onEditSave,
  onEditCancel,
  onStartEdit,
}: TextCardProps) {
  // Parse the JSON content
  const cardContent = content
    ? parseCardContent<TextCardContent>({ content } as any)
    : null;

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.stopPropagation();
      onStartEdit?.();
    }
  };

  // Helper function to render Tiptap content as HTML
  const renderTiptapToHTML = (content: string | JSONContent): string => {
    if (typeof content === "string") {
      // Legacy plain text - convert line breaks to <br>
      return content.replace(/\n/g, "<br>");
    }
    // New Tiptap JSON format
    return generateHTML(content, [StarterKit]);
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

      {(cardContent?.richText || isEditing) && (
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
            <TiptapEditor
              content={cardContent?.richText || ""}
              onSave={(newContent) => onEditSave?.(newContent)}
              onCancel={(newContent) => onEditCancel?.(newContent)}
            />
          ) : (
            cardContent?.richText && (
              <div
                dangerouslySetInnerHTML={{
                  __html: renderTiptapToHTML(cardContent.richText),
                }}
              />
            )
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
