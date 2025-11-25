"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Card } from "antd";
import { parseCardContent } from "@/types/card";
import type { PageCardContent } from "@/types/card";
import { useEditor, EditorContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";
import styles from "@/components/editor/TiptapEditor.module.css";

interface PageCardProps {
  title?: string | null;
  content?: string | null;
  color?: string | null;
  // Inline editing props
  isEditing?: boolean;
  onEditSave?: (content: string) => void;
  onEditCancel?: (content: string) => void;
  onStartEdit?: () => void;
}

function PageCard({
  title,
  content,
  color,
  isEditing = false,
  onEditSave,
  onEditCancel,
  onStartEdit,
}: PageCardProps) {
  // Parse the JSON content
  const cardContent = content
    ? parseCardContent<PageCardContent>({ content } as any)
    : null;

  // State for editing
  const [titleValue, setTitleValue] = useState(cardContent?.title || "");
  const [focusField, setFocusField] = useState<"title" | "description">(
    "title",
  );

  // Refs
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isKeyboardActionRef = useRef(false);

  // Tiptap editor setup
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Type description...",
      }),
    ],
    content: cardContent?.description || { type: "doc", content: [] },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          isKeyboardActionRef.current = true;
          const currentContent = JSON.stringify(view.state.doc.toJSON());
          handleCancel(currentContent);
          return true;
        }
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          event.preventDefault();
          isKeyboardActionRef.current = true;
          const currentContent = JSON.stringify(view.state.doc.toJSON());
          handleSave(currentContent);
          return true;
        }
        return false;
      },
      handleDOMEvents: {
        blur: (view, event) => {
          if (isKeyboardActionRef.current) {
            return false;
          }
          const currentContent = JSON.stringify(view.state.doc.toJSON());
          handleSave(currentContent);
          return false;
        },
      },
    },
    autofocus: focusField === "description" ? "end" : false,
  });

  // Update local state when content changes
  useEffect(() => {
    if (content) {
      const parsed = parseCardContent<PageCardContent>({ content } as any);
      if (parsed) {
        setTitleValue(parsed.title || "");
        // Update editor content
        if (editor && parsed.description) {
          editor.commands.setContent(parsed.description);
        }
      }
    }
  }, [content, editor]);

  // Focus management when entering edit mode
  useEffect(() => {
    if (isEditing && focusField === "title") {
      titleInputRef.current?.focus();
      // Move cursor to end
      const len = titleInputRef.current?.value.length || 0;
      titleInputRef.current?.setSelectionRange(len, len);
    }
  }, [isEditing, focusField]);

  const handleDoubleClickTitle = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.stopPropagation();
      setFocusField("title");
      onStartEdit?.();
    }
  };

  const handleDoubleClickDescription = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.stopPropagation();
      setFocusField("description");
      onStartEdit?.();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      isKeyboardActionRef.current = true;
      // Get current description content from editor
      const descriptionContent = editor
        ? JSON.stringify(editor.getJSON())
        : JSON.stringify({ type: "doc", content: [] });
      handleCancel(descriptionContent);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter: Save if description has content, else move to description
        const descriptionEmpty = !editor || editor.isEmpty;

        if (descriptionEmpty) {
          // Description is empty, just move focus
          editor?.commands.focus();
        } else {
          // Description has content, save the card
          const currentContent = JSON.stringify(editor.getJSON());
          handleSave(currentContent);
        }
      } else {
        // Plain Enter: Move focus to description
        editor?.commands.focus();
      }
    }
  };

  const handleSave = (newDescription: string) => {
    // Combine title and description
    const pageContent = JSON.stringify({
      title: titleValue,
      description: JSON.parse(newDescription),
    });
    onEditSave?.(pageContent);
  };

  const handleCancel = (newDescription: string) => {
    // Combine title and description for cancel
    const pageContent = JSON.stringify({
      title: titleValue,
      description: JSON.parse(newDescription),
    });
    onEditCancel?.(pageContent);
  };

  // Helper function to render Tiptap content as HTML
  const renderTiptapToHTML = (content: JSONContent): string => {
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
        userSelect: isEditing ? "text" : "none",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        cursor: isEditing ? "text" : "pointer",
      }}
      styles={{
        body: {
          padding: "18px",
        },
      }}
      onMouseDown={(e) => {
        // Prevent blur when clicking inside card during editing
        if (isEditing) {
          e.stopPropagation();
        }
      }}
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
      {/* Title */}
      <div
        onDoubleClick={handleDoubleClickTitle}
        onClick={(e) => {
          if (isEditing) {
            e.stopPropagation();
            titleInputRef.current?.focus();
          }
        }}
      >
        {isEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="Page Title"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "12px",
              color: "#333",
              fontFamily: "inherit",
              padding: "4px 0",
              background: "transparent",
            }}
          />
        ) : (
          (titleValue || cardContent?.title) && (
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "12px",
                color: "#333",
              }}
            >
              {titleValue || cardContent?.title}
            </div>
          )
        )}
      </div>

      {/* Description */}
      <div
        onDoubleClick={handleDoubleClickDescription}
        onClick={(e) => {
          if (isEditing) {
            e.stopPropagation();
            editor?.commands.focus();
          }
        }}
      >
        {isEditing ? (
          <div
            className={styles.tiptapEditor}
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#666",
            }}
          >
            {editor && <EditorContent editor={editor} />}
          </div>
        ) : (
          cardContent?.description && (
            <div
              style={{
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#666",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{
                __html: renderTiptapToHTML(cardContent.description),
              }}
            />
          )
        )}
      </div>
    </Card>
  );
}

export default memo(PageCard);
