"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Input, message, Empty } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import CanvasLayout from "@/components/layout/CanvasLayout";
import BoardCanvas from "@/components/canvas/BoardCanvas";
import CanvasCard from "@/components/canvas/CanvasCard";
import TextCard from "@/components/cards/TextCard";
import LinkCard from "@/components/cards/LinkCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { calculateNewZIndex } from "@/lib/collision";
import {
  Card,
  parseCardContent,
  TextCardContent,
  LinkCardContent,
  CardType,
} from "@/types/card";
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
  const [linkForm] = Form.useForm();
  const linkUrlValue = Form.useWatch("url", linkForm);

  // Inline editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

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

  const handleCreateLinkCard = async (values: { url: string }) => {
    setLoading(true);
    try {
      // Validate URL format
      let url = values.url.trim();

      // Add https:// if no protocol specified
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      // Validate URL
      try {
        new URL(url);
      } catch {
        message.error("Please enter a valid URL");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/boards/${boardId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "LINK",
          content: JSON.stringify({
            url: url,
          }),
          positionX: 100 + Math.random() * 200,
          positionY: 100 + Math.random() * 200,
          width: 280,
        }),
      });

      if (res.ok) {
        message.success("Link created successfully");
        linkForm.resetFields();
        setIsModalOpen(false);
        fetchBoard();
      } else {
        const error = await res.json();
        message.error(error.error || "Failed to create link");
      }
    } catch (error) {
      message.error("Failed to create link");
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

  // Inline editing handlers
  const handleStartEdit = useCallback(
    (cardId: string, currentContent: string) => {
      setEditingCardId(cardId);
      setEditingContent(currentContent);
    },
    [],
  );

  const handleEditSave = useCallback(async () => {
    if (!editingCardId || !board) return;

    // Validate content is not empty
    if (!editingContent.trim()) {
      setShowEmptyWarning(true);
      return;
    }

    // Find the card being edited to determine its type
    const card = board.cards.find((c) => c.id === editingCardId);
    if (!card) return;

    try {
      let contentJson;
      let successMessage;

      if (card.type === CardType.LINK) {
        // Validate URL format for link cards
        let url = editingContent.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }

        try {
          new URL(url);
        } catch {
          message.error("Please enter a valid URL");
          return;
        }

        contentJson = JSON.stringify({ url });
        successMessage = "Link updated successfully";
      } else {
        // TEXT card
        contentJson = JSON.stringify({ richText: editingContent });
        successMessage = "Note updated successfully";
      }

      const res = await fetch(`/api/cards/${editingCardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contentJson,
        }),
      });

      if (res.ok) {
        message.success(successMessage);
        setEditingCardId(null);
        setEditingContent("");
        fetchBoard();
      } else {
        const error = await res.json();
        message.error(error.error || "Failed to update card");
      }
    } catch (error) {
      message.error("Failed to update card");
      console.error(error);
    }
  }, [editingCardId, editingContent, board]);

  const handleEditCancel = useCallback(() => {
    setEditingCardId(null);
    setEditingContent("");
  }, []);

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
          {board.cards.map((card) => {
            const isCardEditing = editingCardId === card.id;

            // Parse content based on card type
            const textContent =
              card.type === CardType.TEXT && card.content
                ? parseCardContent<TextCardContent>({
                    content: card.content,
                  } as any)
                : null;

            const linkContent =
              card.type === CardType.LINK && card.content
                ? parseCardContent<LinkCardContent>({
                    content: card.content,
                  } as any)
                : null;

            return (
              <CanvasCard
                key={card.id}
                id={card.id}
                x={card.positionX}
                y={card.positionY}
                width={card.width}
                zIndex={card.zIndex}
                isEditing={isCardEditing}
              >
                {card.type === CardType.TEXT && (
                  <TextCard
                    title={card.title}
                    content={card.content}
                    color={card.color}
                    isEditing={isCardEditing}
                    editingContent={editingContent}
                    onEditingContentChange={setEditingContent}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    onStartEdit={() =>
                      handleStartEdit(card.id, textContent?.richText || "")
                    }
                  />
                )}
                {card.type === CardType.LINK && (
                  <LinkCard
                    content={card.content}
                    color={card.color}
                    isEditing={isCardEditing}
                    editingContent={editingContent}
                    onEditingContentChange={setEditingContent}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    onStartEdit={() =>
                      handleStartEdit(card.id, linkContent?.url || "")
                    }
                  />
                )}
              </CanvasCard>
            );
          })}
        </BoardCanvas>

        {/* Create Note Modal */}
        {cardType === CardType.TEXT && (
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
                    <Button onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
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
        )}

        {/* Create Link Modal */}
        {cardType === CardType.LINK && (
          <Modal
            title="Create Link"
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
              <Form
                form={linkForm}
                layout="vertical"
                onFinish={handleCreateLinkCard}
              >
                <Form.Item
                  name="url"
                  rules={[{ required: true, message: "Please enter a URL" }]}
                >
                  <Input
                    placeholder="https://example.com"
                    autoFocus
                    prefix={<LinkOutlined style={{ color: "#1890ff" }} />}
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
                    <Button onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      disabled={!linkUrlValue?.trim()}
                    >
                      Create
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        )}

        {/* Empty Note Warning Modal */}
        <ConfirmationModal
          open={showEmptyWarning}
          title="Cannot Save Empty Note"
          description="Notes cannot be empty. Please enter some content or press Escape to cancel editing."
          confirmText="OK"
          onConfirm={() => setShowEmptyWarning(false)}
          onCancel={() => setShowEmptyWarning(false)}
        />
      </CanvasLayout>
    </ErrorBoundary>
  );
}
