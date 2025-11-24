"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";
import styles from "./TiptapEditor.module.css";

interface TiptapEditorProps {
  content: string | JSONContent;
  onSave: (content: string) => void;
  onCancel: (content: string) => void;
}

function convertPlainTextToTiptap(text: string): JSONContent {
  return {
    type: "doc",
    content: text.split("\n").map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : [],
    })),
  };
}

export default function TiptapEditor({
  content,
  onSave,
  onCancel,
}: TiptapEditorProps) {
  // Guard to prevent blur from firing after keyboard save/cancel
  const isKeyboardActionRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Type something...",
      }),
    ],
    content: (() => {
      if (typeof content === "string") {
        try {
          // Try to parse as JSON first (for Tiptap JSONContent)
          return JSON.parse(content);
        } catch {
          // If parsing fails, treat as plain text (legacy)
          return convertPlainTextToTiptap(content);
        }
      }
      return content;
    })(),
    // No onUpdate - we don't need to track content during typing
    // Content is only needed when saving or canceling
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          // Set guard to prevent blur from also firing
          isKeyboardActionRef.current = true;
          // Pass current content when canceling
          const currentContent = JSON.stringify(view.state.doc.toJSON());
          onCancel(currentContent);
          return true;
        }
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          event.preventDefault();
          // Set guard to prevent blur from also firing
          isKeyboardActionRef.current = true;
          // Pass current content when saving
          const currentContent = JSON.stringify(view.state.doc.toJSON());
          onSave(currentContent);
          return true;
        }
        return false;
      },
      handleDOMEvents: {
        blur: (view, event) => {
          // Skip if already handled by keyboard action (Escape or Ctrl+Enter)
          if (isKeyboardActionRef.current) {
            return false;
          }
          // Pass current content when saving on blur
          const currentContent = JSON.stringify(view.state.doc.toJSON());
          onSave(currentContent);
          return false;
        },
      },
    },
    autofocus: "end",
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.tiptapEditor}>
      <EditorContent editor={editor} />
    </div>
  );
}
