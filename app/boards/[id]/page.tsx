"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Input, message, Empty } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import CanvasLayout from "@/components/layout/CanvasLayout";
import BoardCanvas from "@/components/canvas/BoardCanvas";
import CanvasCard from "@/components/canvas/CanvasCard";
import TextCard from "@/components/cards/TextCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { calculateNewZIndex } from "@/lib/collision";
import { Card } from "@/types/card";
import { COLORS } from "@/theme";

const { TextArea } = Input;

interface Board {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  folderId: string | null;
  cards: Card[];
  project: {
    id: string;
    name: string;
  };
  folder: {
    id: string;
    name: string;
  } | null;
}

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardType, setCardType] = useState<string>("TEXT");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [form] = Form.useForm();
  const contentValue = Form.useWatch("content", form);

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) {
        if (res.status === 404) {
          message.error("Board not found");
        } else {
          throw new Error("Failed to fetch board");
        }
        return;
      }
      const data = await res.json();
      setBoard(data);
    } catch (error) {
      message.error("Failed to fetch board");
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleCreateCard = async (values: { content: string }) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/boards/${boardId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TEXT",
          content: JSON.stringify({
            richText: values.content,
          }),
          positionX: 100 + Math.random() * 200,
          positionY: 100 + Math.random() * 200,
          width: 280,
        }),
      });

      if (res.ok) {
        message.success("Note created successfully");
        form.resetFields();
        setIsModalOpen(false);
        fetchBoard();
      } else {
        const error = await res.json();
        message.error(error.error || "Failed to create note");
      }
    } catch (error) {
      message.error("Failed to create note");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = useCallback((type: string) => {
    setCardType(type);
    setIsModalOpen(true);
  }, []);

  const handleCardMove = useCallback(
    async (cardId: string, deltaX: number, deltaY: number) => {
      // Find the card
      const card = board?.cards.find((c) => c.id === cardId);
      if (!card || !board) return;

      // Calculate new position
      const newX = card.positionX + deltaX;
      const newY = card.positionY + deltaY;

      // Create temporary card with new position for collision check
      const movedCard = { ...card, positionX: newX, positionY: newY };

      // Check if zIndex needs updating based on overlapping cards
      const newZIndex = calculateNewZIndex(movedCard, board.cards);

      // Prepare update data
      const updateData: {
        positionX: number;
        positionY: number;
        zIndex?: number;
      } = {
        positionX: newX,
        positionY: newY,
      };

      // Include zIndex if it needs to be updated
      if (newZIndex !== null) {
        updateData.zIndex = newZIndex;
      }

      // Optimistic update - include zIndex if changed
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          cards: prev.cards.map((c) =>
            c.id === cardId ? { ...c, ...updateData } : c,
          ),
        };
      });

      // Update on server - include zIndex if changed
      try {
        const res = await fetch(`/api/cards/${cardId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!res.ok) {
          throw new Error("Failed to update position");
        }
      } catch (error) {
        console.error("Failed to update card position:", error);
        // Revert on error
        fetchBoard();
      }
    },
    [board],
  );

  if (fetchLoading) {
    return (
      <ErrorBoundary>
        <LoadingState message="Loading phalak..." fullScreen />
      </ErrorBoundary>
    );
  }

  if (!board) {
    return (
      <ErrorBoundary>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f5f2",
          }}
        >
          <Empty description="Phalakam not found">
            <Link href="/">
              <Button type="primary">Back to Projects</Button>
            </Link>
          </Empty>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <CanvasLayout boardName={board.name} onAddCard={handleAddCard}>
        {/* Canvas */}
        <BoardCanvas onCardMove={handleCardMove}>
          {board.cards.map((card) => (
            <CanvasCard
              key={card.id}
              id={card.id}
              x={card.positionX}
              y={card.positionY}
              width={card.width}
              zIndex={card.zIndex}
            >
              <TextCard
                title={card.title}
                content={card.content}
                color={card.color}
              />
            </CanvasCard>
          ))}
        </BoardCanvas>

        {/* Create Card Modal */}
        <Modal
          title="Create Note"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          destroyOnHidden
        >
          <div
            style={{
              marginBottom: 24,
              color: COLORS.text.primary,
              lineHeight: 1.6,
            }}
          >
            <Form form={form} layout="vertical" onFinish={handleCreateCard}>
              <Form.Item
                name="content"
                rules={[
                  { required: true, message: "Please enter note content" },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Type your note here..."
                  autoFocus
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={!contentValue?.trim()}
                  >
                    Create
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </CanvasLayout>
    </ErrorBoundary>
  );
}
