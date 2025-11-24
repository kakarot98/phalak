"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode, memo } from "react";

interface CanvasCardProps {
  id: string;
  x: number;
  y: number;
  width?: number;
  children: ReactNode;
  zIndex?: number;
  isEditing?: boolean;
  onClick?: () => void;
}

function CanvasCard({
  id,
  x,
  y,
  width = 280,
  children,
  zIndex = 0,
  isEditing = false,
  onClick,
}: CanvasCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: isEditing, // Disable dragging when editing
    });

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    transform: CSS.Translate.toString(transform),
    zIndex: zIndex, // DragOverlay handles the floating preview
    cursor: isEditing ? "default" : isDragging ? "grabbing" : "grab",
    // When dragging, show a dimmed placeholder at original position
    opacity: isDragging ? 0.3 : 1,
    transition: isDragging ? "none" : "opacity 0.2s",
    // Add dashed outline when dragging to show placeholder
    outline: isDragging ? "2px dashed #ccc" : "none",
    outlineOffset: isDragging ? "2px" : "0",
  };

  const handleMouseDown = () => {
    onClick?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}

export default memo(CanvasCard);
