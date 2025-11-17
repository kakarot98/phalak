/**
 * Shared entity type definitions
 * Consolidates duplicate interfaces across pages
 */

// Base entity with common fields
export interface BaseEntity {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// Project entity
export interface Project extends BaseEntity {
  folders: Folder[] | { id: string }[];
  boards: Board[] | { id: string }[];
  _count?: {
    folders: number;
    boards: number;
  };
}

// Folder entity
export interface Folder extends BaseEntity {
  projectId: string;
  parentFolderId: string | null;
  subFolders: SubFolder[];
  boards: Board[];
  project: {
    id: string;
    name: string;
  };
  parentFolder: {
    id: string;
    name: string;
  } | null;
  _count?: {
    boards: number;
    subFolders: number;
  };
}

// SubFolder (same structure as Folder but semantically different)
export type SubFolder = Folder;

// Board/Phalak entity
export interface Board extends BaseEntity {
  projectId: string;
  folderId: string | null;
  cards: Card[];
  project?: {
    id: string;
    name: string;
  };
  folder?: {
    id: string;
    name: string;
  } | null;
}

// Card entity (for boards)
export interface Card {
  id: string;
  boardId: string;
  title: string;
  content: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  type: "text" | "image" | "link";
  createdAt: string;
  updatedAt: string;
}

// Form value types for creation
export interface CreateEntityValues {
  name: string;
  description?: string;
}

export interface CreateProjectValues extends CreateEntityValues {}

export interface CreateFolderValues extends CreateEntityValues {
  projectId: string;
  parentFolderId?: string;
}

export interface CreateBoardValues extends CreateEntityValues {
  projectId: string;
  folderId?: string;
}

export interface CreateCardValues {
  boardId: string;
  title: string;
  content: string;
  type: "text" | "image" | "link";
  positionX: number;
  positionY: number;
  width?: number;
  height?: number;
}

// Update value types
export interface UpdateEntityValues {
  name?: string;
  description?: string | null;
}

export interface UpdateCardPositionValues {
  positionX: number;
  positionY: number;
}

export interface UpdateCardValues extends UpdateEntityValues {
  title?: string;
  content?: string;
  width?: number;
  height?: number;
}

// API Response types
export interface ApiError {
  error: string;
  details?: any;
}

export interface ApiSuccess<T = any> {
  data: T;
  message?: string;
}

// Entity type union for type discrimination
export type Entity = Project | Folder | Board | Card;

// Entity type enum for consistency
export enum EntityType {
  PROJECT = "project",
  FOLDER = "folder",
  PHALAK = "phalak",
  CARD = "card",
}
