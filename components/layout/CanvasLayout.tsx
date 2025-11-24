"use client";

import { useState, useCallback } from "react";
import { Layout } from "antd";
import { ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { Card } from "antd";
import { FileTextOutlined, LinkOutlined } from "@ant-design/icons";
import CanvasHeader from "./CanvasHeader";
import CanvasToolbar from "./CanvasToolbar";

const { Content } = Layout;

interface CanvasLayoutProps {
  children: ReactNode;
  boardName: string;
  boardColor?: string;
  project?: { id: string; name: string } | null;
  folder?: { id: string; name: string } | null;
  onAddCard?: (type: string) => void;
  onCreateCardAtPosition?: (type: string, x: number, y: number) => void;
  onCardMove?: (cardId: string, deltaX: number, deltaY: number) => void;
  onDeleteCard?: (cardId: string) => void;
  scale?: number;
}

// Ghost card preview component for drag overlay
function GhostCard({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    TEXT: <FileTextOutlined style={{ fontSize: 20, color: "#666" }} />,
    LINK: <LinkOutlined style={{ fontSize: 20, color: "#1890ff" }} />,
  };

  const labels: Record<string, string> = {
    TEXT: "New Note",
    LINK: "New Link",
  };

  return (
    <Card
      style={{
        width: 280,
        opacity: 0.9,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        borderRadius: 6,
        pointerEvents: "none",
      }}
      styles={{ body: { padding: "16px" } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icons[type] || null}
        <span style={{ color: "#666", fontSize: 13 }}>
          {labels[type] || "New Card"}
        </span>
      </div>
    </Card>
  );
}

export default function CanvasLayout({
  children,
  boardName,
  boardColor,
  project,
  folder,
  onAddCard,
  onCreateCardAtPosition,
  onCardMove,
  onDeleteCard,
  scale = 1,
}: CanvasLayoutProps) {
  const [activeDragType, setActiveDragType] = useState<string | null>(null);

  // Configure sensors with activation constraint
  // This allows for small movements without starting drag (distinguishes click vs drag)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start drag after 8px of movement
      },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    // Check if this is a toolbar item being dragged
    if (active.data.current?.type === "toolbar-item") {
      setActiveDragType(active.data.current.cardType);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta, over } = event;

      // Reset drag state
      setActiveDragType(null);

      // Check if this is a toolbar item being dropped
      if (active.data.current?.type === "toolbar-item") {
        const cardType = active.data.current.cardType;

        // Check if dropped on canvas
        if (over?.id === "canvas-droppable") {
          // Get the drop position from the over data
          const dropData = over.data.current;
          if (dropData && onCreateCardAtPosition) {
            // Calculate position accounting for canvas offset and scale
            const canvasRect = dropData.rect;
            const pan = dropData.pan || { x: 0, y: 0 };

            // Get pointer position from the active element's final position
            // The delta gives us how far from the starting point
            const pointerX = (event as any).activatorEvent?.clientX + delta.x;
            const pointerY = (event as any).activatorEvent?.clientY + delta.y;

            if (
              pointerX !== undefined &&
              pointerY !== undefined &&
              canvasRect
            ) {
              // Convert screen coordinates to canvas coordinates
              const canvasX = (pointerX - canvasRect.left - pan.x) / scale;
              const canvasY = (pointerY - canvasRect.top - pan.y) / scale;

              onCreateCardAtPosition(cardType, canvasX, canvasY);
            }
          }
        }
        return;
      }

      // Check if card is dropped on trash
      if (over?.id === "trash-droppable") {
        // Delete the card
        if (onDeleteCard) {
          onDeleteCard(active.id as string);
        }
        return;
      }

      // Handle existing card move
      if (onCardMove && (delta.x !== 0 || delta.y !== 0)) {
        onCardMove(active.id as string, delta.x / scale, delta.y / scale);
      }
    },
    [onCreateCardAtPosition, onCardMove, onDeleteCard, scale],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Layout style={{ minHeight: "100vh", background: "#fffef6" }}>
        <CanvasHeader
          boardName={boardName}
          boardColor={boardColor}
          project={project}
          folder={folder}
        />
        <CanvasToolbar onAddCard={onAddCard} />
        <Content
          style={{
            position: "relative",
            minHeight: "calc(100vh - 95px)",
            marginTop: 95, // Account for fixed header
            background: "#fffef6",
            backgroundImage:
              "radial-gradient(circle, #d1d1d1 1px, transparent 1px)",
            backgroundSize: "9px 9px",
          }}
        >
          {/* Unsorted Button (top right) */}
          <div
            style={{
              position: "fixed",
              top: 115,
              right: 95,
              background: "#ebedee",
              borderRadius: 3,
              padding: "5px 12px",
              fontSize: 10.8,
              fontWeight: 700,
              color: "#666d7a",
              opacity: 0.5,
              fontFamily: "Inter, sans-serif",
              zIndex: 99,
            }}
          >
            0 <span style={{ fontWeight: 400 }}>Unsorted</span>
          </div>

          {children}
        </Content>
      </Layout>

      {/* Drag Overlay - shows ghost card while dragging from toolbar */}
      <DragOverlay dropAnimation={null}>
        {activeDragType ? <GhostCard type={activeDragType} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
