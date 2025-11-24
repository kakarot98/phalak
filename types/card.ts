/**
 * Card Types for Phalakam (Milanote clone)
 *
 * Cards are the fundamental building blocks on a board.
 * Each card has a type that determines its content structure and behavior.
 */

import type { JSONContent } from "@tiptap/core";

export enum CardType {
  TEXT = "TEXT",
  TODO = "TODO",
  IMAGE = "IMAGE",
  LINK = "LINK",
  COLUMN = "COLUMN",
  SUBBOARD = "SUBBOARD",
}

// ===== Content Type Definitions =====
// These define the JSON structure stored in Card.content for each type

/**
 * TEXT card content
 * Supports rich text editing (Tiptap format)
 * Backward compatible with plain text strings
 */
export interface TextCardContent {
  richText: string | JSONContent; // Plain text (legacy) or Tiptap JSON
  source?: string; // Optional reference/citation
}

/**
 * TODO card content
 * A checklist with items
 */
export interface TodoCardContent {
  items: TodoItem[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

/**
 * IMAGE card content
 * Stores image file information
 */
export interface ImageCardContent {
  filename: string; // Original filename
  filepath: string; // Path in local filesystem
  url: string; // Serving URL
  width: number; // Original image width
  height: number; // Original image height
  caption?: string; // Optional caption
}

/**
 * LINK card content
 * Web link with preview metadata
 */
export interface LinkCardContent {
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  thumbnail?: string;
  showPreview: boolean; // Toggle preview display
}

/**
 * COLUMN card content
 * A vertical container for other cards
 */
export interface ColumnCardContent {
  title: string;
  childCardIds: string[]; // Cards contained in this column
}

/**
 * SUBBOARD card content
 * Links to another board (linkedBoardId is in the Card model)
 */
export interface SubBoardCardContent {
  preview?: string; // Board thumbnail or description
}

// ===== Union Type for Type Safety =====

export type CardContentData =
  | TextCardContent
  | TodoCardContent
  | ImageCardContent
  | LinkCardContent
  | ColumnCardContent
  | SubBoardCardContent;

// ===== Full Card Interface (matches Prisma model) =====

export interface Card {
  id: string;
  boardId: string;
  type: CardType;

  // Position and dimensions
  positionX: number;
  positionY: number;
  width: number;
  height?: number | null;
  zIndex: number;

  // Visual styling
  color?: string | null;

  // Content
  title?: string | null;
  content?: string | null; // JSON string

  // For SUBBOARD type
  linkedBoardId?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// ===== Helper Type Guards =====

export function isTextCard(card: Card): card is Card & { content: string } {
  return card.type === CardType.TEXT;
}

export function isTodoCard(card: Card): card is Card & { content: string } {
  return card.type === CardType.TODO;
}

export function isImageCard(card: Card): card is Card & { content: string } {
  return card.type === CardType.IMAGE;
}

export function isLinkCard(card: Card): card is Card & { content: string } {
  return card.type === CardType.LINK;
}

export function isColumnCard(card: Card): card is Card & { content: string } {
  return card.type === CardType.COLUMN;
}

export function isSubBoardCard(
  card: Card,
): card is Card & { linkedBoardId: string } {
  return card.type === CardType.SUBBOARD;
}

// ===== Content Parsing Helpers =====

export function parseCardContent<T>(card: Card): T | null {
  if (!card.content) return null;
  try {
    return JSON.parse(card.content) as T;
  } catch {
    return null;
  }
}

export function stringifyCardContent(content: CardContentData): string {
  return JSON.stringify(content);
}
