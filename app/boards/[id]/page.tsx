"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Empty, App } from "antd";
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
import { Card, CardType } from "@/types/card";
import { getCardTypeConfig, isTiptapContentEmpty } from "@/lib/cardTypes";

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
  const { message } = App.useApp();

  const [board, setBoard] = useState<Board | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Inline editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  // Track temporary cards that haven't been saved to backend yet
  const [tempCardIds, setTempCardIds] = useState<Set<string>>(new Set());

  // Track canvas scale for coordinate calculations
  const [canvasScale, setCanvasScale] = useState(1);

  // Guard to prevent duplicate saves (from blur + keyboard events)
  const isSavingRef = useRef(false);

  // Track pending move operations per card to prevent race conditions
  const pendingMovesRef = useRef<Map<string, boolean>>(new Map());

  // Ref to access board state without creating callback dependencies
  const boardRef = useRef<Board | null>(null);

  // Keep boardRef in sync with board state
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

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

  const handleAddCard = useCallback(
    (type: string) => {
      if (type === CardType.TEXT || type === CardType.LINK) {
        // Create temporary card for direct inline editing
        const tempId = `temp-${Date.now()}`;

        // Calculate highest z-index to place new card on top
        const maxZIndex = board?.cards.length
          ? Math.max(...board.cards.map((c) => c.zIndex))
          : 0;

        // Get card type configuration
        const cardConfig = getCardTypeConfig(type as CardType);
        const initialContent = cardConfig.initialContent();

        const tempCard: Card = {
          id: tempId,
          type: type as CardType,
          content: initialContent,
          positionX: 300,
          positionY: 200,
          width: 280,
          zIndex: maxZIndex + 1,
          title: null,
          color: null,
          boardId: boardId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Add temporary card to board
        setBoard((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            cards: [...prev.cards, tempCard],
          };
        });

        // Track as temporary
        setTempCardIds((prev) => new Set(prev).add(tempId));

        // Start editing immediately
        setEditingCardId(tempId);
      }
    },
    [boardId, board],
  );

  // Create card at specific position (for drag-drop from toolbar)
  const handleCreateCardAtPosition = useCallback(
    (type: string, x: number, y: number) => {
      if (type === CardType.TEXT || type === CardType.LINK) {
        // Create temporary card for direct inline editing
        const tempId = `temp-${Date.now()}`;

        // Calculate highest z-index to place new card on top
        const currentBoard = boardRef.current;
        const maxZIndex = currentBoard?.cards.length
          ? Math.max(...currentBoard.cards.map((c) => c.zIndex))
          : 0;

        // Get card type configuration
        const cardConfig = getCardTypeConfig(type as CardType);
        const initialContent = cardConfig.initialContent();

        const tempCard: Card = {
          id: tempId,
          type: type as CardType,
          content: initialContent,
          positionX: Math.max(0, x - 140), // Center the card on drop point (card width is ~280)
          positionY: Math.max(0, y - 20), // Slight offset from cursor
          width: 280,
          zIndex: maxZIndex + 1,
          title: null,
          color: null,
          boardId: boardId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Add temporary card to board
        setBoard((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            cards: [...prev.cards, tempCard],
          };
        });

        // Track as temporary
        setTempCardIds((prev) => new Set(prev).add(tempId));

        // Start editing immediately
        setEditingCardId(tempId);
      }
    },
    [boardId],
  );

  // Stable callback using ref - prevents race conditions on rapid moves
  const handleCardMove = useCallback(
    async (cardId: string, deltaX: number, deltaY: number) => {
      const currentBoard = boardRef.current;
      if (!currentBoard) return;

      // Skip if a move is already in progress for this card
      if (pendingMovesRef.current.get(cardId)) {
        return;
      }

      // Find the card from current board state
      const card = currentBoard.cards.find((c) => c.id === cardId);
      if (!card) return;

      // Mark move as in progress
      pendingMovesRef.current.set(cardId, true);

      try {
        // Calculate new position
        const newX = card.positionX + deltaX;
        const newY = card.positionY + deltaY;

        // Create temporary card with new position for collision check
        const movedCard = { ...card, positionX: newX, positionY: newY };

        // Check if zIndex needs updating based on overlapping cards
        const newZIndex = calculateNewZIndex(movedCard, currentBoard.cards);

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

        // Update on server
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
        // Revert on error - use functional update to get fresh state
        setBoard((prev) => {
          if (!prev) return prev;
          // Keep current state, error will be logged but UI stays responsive
          return prev;
        });
      } finally {
        // Always clear pending status
        pendingMovesRef.current.delete(cardId);
      }
    },
    [], // No dependencies - uses ref
  );

  // Bring card to top (update z-index) - stable callback using ref
  const bringCardToTop = useCallback(async (cardId: string) => {
    const currentBoard = boardRef.current;
    if (!currentBoard) return;

    const card = currentBoard.cards.find((c) => c.id === cardId);
    if (!card) return;

    const maxZIndex = Math.max(...currentBoard.cards.map((c) => c.zIndex));
    // Only update if not already at top
    if (card.zIndex >= maxZIndex) return;

    const newZIndex = maxZIndex + 1;

    // Optimistic update
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === cardId ? { ...c, zIndex: newZIndex } : c,
        ),
      };
    });

    // Update on server
    try {
      await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zIndex: newZIndex }),
      });
    } catch (error) {
      console.error("Failed to update card z-index:", error);
    }
  }, []); // No dependencies - uses ref

  // Inline editing handlers - stable callback
  const handleStartEdit = useCallback(
    (cardId: string) => {
      setEditingCardId(cardId);
      bringCardToTop(cardId);
    },
    [bringCardToTop],
  ); // bringCardToTop is now stable

  const handleEditSave = useCallback(
    async (content: string) => {
      // Prevent duplicate saves (from blur + keyboard events firing together)
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      try {
        if (!editingCardId || !board) return;

        // Find the card being edited to determine its type
        const card = board.cards.find((c) => c.id === editingCardId);
        if (!card) return;

        const isTemporary = tempCardIds.has(editingCardId);
        const isEmpty = isTiptapContentEmpty(content);

        // Handle temporary cards
        if (isTemporary) {
          if (isEmpty) {
            // Remove temporary card silently (no backend call, no warning)
            setBoard((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                cards: prev.cards.filter((c) => c.id !== editingCardId),
              };
            });
            setTempCardIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(editingCardId);
              return newSet;
            });
            setEditingCardId(null);
            return;
          }

          // Save temporary card to backend
          const cardConfig = getCardTypeConfig(card.type);
          const validation = cardConfig.validateContent(content);
          if (!validation.valid) {
            message.error(validation.error || "Invalid content");
            return;
          }

          const contentJson = cardConfig.formatForSave(content);
          const res = await fetch(`/api/boards/${boardId}/cards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: card.type,
              content: contentJson,
              positionX: card.positionX,
              positionY: card.positionY,
              width: card.width,
            }),
          });

          if (res.ok) {
            const newCard = await res.json();
            message.success(cardConfig.messages.createSuccess);
            setBoard((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                cards: prev.cards.map((c) =>
                  c.id === editingCardId ? newCard : c,
                ),
              };
            });
            setTempCardIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(editingCardId);
              return newSet;
            });
            setEditingCardId(null);
          } else {
            const error = await res.json();
            message.error(error.error || cardConfig.messages.createError);
          }
          return;
        }

        // Handle existing cards (non-temporary)
        if (isEmpty) {
          // Delete existing empty card
          const res = await fetch(`/api/cards/${editingCardId}`, {
            method: "DELETE",
          });

          if (res.ok) {
            message.success("Card deleted");
            setBoard((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                cards: prev.cards.filter((c) => c.id !== editingCardId),
              };
            });
            setEditingCardId(null);
          } else {
            message.error("Failed to delete card");
          }
          return;
        }

        // Update existing card
        const cardConfig = getCardTypeConfig(card.type);
        const validation = cardConfig.validateContent(content);
        if (!validation.valid) {
          message.error(validation.error || "Invalid content");
          return;
        }

        const contentJson = cardConfig.formatForSave(content);
        const res = await fetch(`/api/cards/${editingCardId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: contentJson }),
        });

        if (res.ok) {
          const updatedCard = await res.json();
          message.success(cardConfig.messages.updateSuccess);
          setBoard((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              cards: prev.cards.map((c) =>
                c.id === editingCardId ? updatedCard : c,
              ),
            };
          });
          setEditingCardId(null);
        } else {
          const error = await res.json();
          message.error(error.error || cardConfig.messages.updateError);
        }
      } catch (error) {
        message.error("Operation failed");
        console.error(error);
      } finally {
        // Guaranteed reset - prevents stuck state
        isSavingRef.current = false;
      }
    },
    [editingCardId, board, tempCardIds, boardId, message],
  );

  const handleEditCancel = useCallback(
    async (content: string) => {
      if (!editingCardId || !board) return;

      const card = board.cards.find((c) => c.id === editingCardId);
      if (!card) return;

      const isTemporary = tempCardIds.has(editingCardId);

      // Check if current editing content is empty (both TEXT and LINK use Tiptap now)
      const isEmpty = isTiptapContentEmpty(content);

      // If empty, delete the card
      if (isEmpty) {
        if (isTemporary) {
          // Remove temporary card locally
          setBoard((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              cards: prev.cards.filter((c) => c.id !== editingCardId),
            };
          });
          setTempCardIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(editingCardId);
            return newSet;
          });
        } else {
          // Delete existing card from backend
          try {
            const res = await fetch(`/api/cards/${editingCardId}`, {
              method: "DELETE",
            });

            if (res.ok) {
              message.success("Card deleted");
              setBoard((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  cards: prev.cards.filter((c) => c.id !== editingCardId),
                };
              });
            } else {
              message.error("Failed to delete card");
            }
          } catch (error) {
            message.error("Failed to delete card");
            console.error(error);
          }
        }
      }

      // Clear editing state
      setEditingCardId(null);
    },
    [editingCardId, tempCardIds, board, message],
  );

  // Memoized callback maps for stable references - only recreate when card IDs change
  const cardCallbacks = useMemo(() => {
    if (!board) return {};

    const callbacks: Record<
      string,
      {
        onClick: () => void;
        onStartEdit: () => void;
      }
    > = {};

    board.cards.forEach((card) => {
      callbacks[card.id] = {
        onClick: () => bringCardToTop(card.id),
        onStartEdit: () => handleStartEdit(card.id),
      };
    });

    return callbacks;
  }, [
    board?.cards.map((c) => c.id).join(","),
    bringCardToTop,
    handleStartEdit,
  ]);

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
      <CanvasLayout
        boardName={board.name}
        onAddCard={handleAddCard}
        onCreateCardAtPosition={handleCreateCardAtPosition}
        onCardMove={handleCardMove}
        scale={canvasScale}
      >
        {/* Canvas */}
        <BoardCanvas onScaleChange={setCanvasScale}>
          {board.cards.map((card) => {
            const isCardEditing = editingCardId === card.id;
            const callbacks = cardCallbacks[card.id];

            return (
              <CanvasCard
                key={card.id}
                id={card.id}
                x={card.positionX}
                y={card.positionY}
                width={card.width}
                zIndex={card.zIndex}
                isEditing={isCardEditing}
                onClick={callbacks?.onClick}
              >
                {card.type === CardType.TEXT && (
                  <TextCard
                    title={card.title}
                    content={card.content}
                    color={card.color}
                    isEditing={isCardEditing}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    onStartEdit={callbacks?.onStartEdit}
                  />
                )}
                {card.type === CardType.LINK && (
                  <LinkCard
                    content={card.content}
                    color={card.color}
                    isEditing={isCardEditing}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    onStartEdit={callbacks?.onStartEdit}
                  />
                )}
              </CanvasCard>
            );
          })}
        </BoardCanvas>

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
