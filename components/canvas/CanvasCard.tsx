"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

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

export default function CanvasCard({
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
    zIndex: isDragging ? 1000 : zIndex,
    cursor: isEditing ? "default" : isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.8 : 1,
    transition: isDragging ? "none" : "opacity 0.2s",
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
