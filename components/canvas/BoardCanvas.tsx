"use client";

import { useState, useRef, useCallback, ReactNode, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";

interface BoardCanvasProps {
  children: ReactNode;
  onScaleChange?: (scale: number) => void;
}

export default function BoardCanvas({
  children,
  onScaleChange,
}: BoardCanvasProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Make the canvas a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-droppable",
    data: {
      // Pass canvas info for position calculation
      pan,
      scale,
      rect: canvasRef.current?.getBoundingClientRect(),
    },
  });

  // Notify parent of scale changes
  useEffect(() => {
    onScaleChange?.(scale);
  }, [scale, onScaleChange]);

  // Handle mouse wheel for zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newScale = Math.min(Math.max(0.5, scale + delta), 2);
        setScale(newScale);
      } else {
        // Scroll for pan
        setPan((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    },
    [scale],
  );

  // Handle mouse down for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only pan if clicking on canvas background (not on cards)
      if (
        e.target === canvasRef.current ||
        (e.target as HTMLElement).classList.contains("canvas-background")
      ) {
        setIsPanning(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    },
    [pan],
  );

  // Handle mouse move for panning
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isPanning, dragStart],
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Combine refs for both canvas ref and droppable
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      // Set the canvas ref
      (canvasRef as any).current = node;
      // Set the droppable ref
      setNodeRef(node);
    },
    [setNodeRef],
  );

  return (
    <div
      ref={setRefs}
      className="board-canvas"
      style={{
        width: "100%",
        height: "calc(100vh - 64px)", // Full height minus header
        overflow: "hidden",
        position: "relative",
        background: "#f7f5f2", // Milanote beige background
        cursor: isPanning ? "grabbing" : "default",
        // Visual feedback when dragging over
        outline: isOver ? "2px dashed #1890ff" : "none",
        outlineOffset: "-2px",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Canvas Content with Pan/Zoom Transform */}
      <div
        className="canvas-background"
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          position: "relative",
          transition: isPanning ? "none" : "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>

      {/* Zoom Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          background: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: "12px",
          color: "#666",
        }}
      >
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
