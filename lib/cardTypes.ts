import { CardType } from "@/types/card";

/**
 * Card Type Registry
 *
 * This registry defines the behavior and configuration for each card type.
 * To add a new card type:
 * 1. Add the type to CardType enum in types/card.ts
 * 2. Add a configuration object here
 * 3. Create a card component (e.g., TodoCard.tsx)
 */

export interface CardTypeConfig {
  type: CardType;
  /** Generate initial content for a new card */
  initialContent: () => string;
  /** Validate content before saving - return error message if invalid */
  validateContent: (content: string) => { valid: boolean; error?: string };
  /** Format content for saving to backend */
  formatForSave: (tiptapContent: string) => string;
  /** Check if content is empty */
  isEmpty: (tiptapContent: string) => boolean;
  /** Success messages for notifications */
  messages: {
    createSuccess: string;
    updateSuccess: string;
    createError: string;
    updateError: string;
  };
}

// Helper to extract plain text from Tiptap JSON content
export const extractTextFromTiptap = (content: string): string => {
  try {
    const parsed = JSON.parse(content);
    if (!parsed.content) return "";
    return parsed.content
      .map((node: any) =>
        node.content ? node.content.map((n: any) => n.text || "").join("") : "",
      )
      .join("\n")
      .trim();
  } catch {
    return content.trim();
  }
};

// Helper to check if Tiptap content is empty
export const isTiptapContentEmpty = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return (
      !parsed.content ||
      parsed.content.every(
        (node: any) => !node.content || node.content.length === 0,
      )
    );
  } catch {
    return !content.trim();
  }
};

// Helper to validate URL
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper to normalize URL (add https:// if missing)
const normalizeUrl = (url: string): string => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
};

/**
 * TEXT Card Configuration
 */
const textCardConfig: CardTypeConfig = {
  type: CardType.TEXT,
  initialContent: () => JSON.stringify({ richText: "" }),
  validateContent: () => ({ valid: true }), // Text cards accept any content
  formatForSave: (tiptapContent: string) => {
    try {
      const tiptapJson = JSON.parse(tiptapContent);
      return JSON.stringify({ richText: tiptapJson });
    } catch {
      return JSON.stringify({ richText: tiptapContent });
    }
  },
  isEmpty: isTiptapContentEmpty,
  messages: {
    createSuccess: "Note created successfully",
    updateSuccess: "Note updated successfully",
    createError: "Failed to create note",
    updateError: "Failed to update note",
  },
};

/**
 * LINK Card Configuration
 */
const linkCardConfig: CardTypeConfig = {
  type: CardType.LINK,
  initialContent: () => JSON.stringify({ url: "" }),
  validateContent: (tiptapContent: string) => {
    const text = extractTextFromTiptap(tiptapContent);
    if (!text) {
      return { valid: false, error: "Please enter a URL" };
    }
    const url = normalizeUrl(text);
    if (!isValidUrl(url)) {
      return { valid: false, error: "Please enter a valid URL" };
    }
    return { valid: true };
  },
  formatForSave: (tiptapContent: string) => {
    const text = extractTextFromTiptap(tiptapContent);
    const url = normalizeUrl(text);
    return JSON.stringify({ url });
  },
  isEmpty: isTiptapContentEmpty,
  messages: {
    createSuccess: "Link created successfully",
    updateSuccess: "Link updated successfully",
    createError: "Failed to create link",
    updateError: "Failed to update link",
  },
};

/**
 * PAGE Card Configuration
 */
const pageCardConfig: CardTypeConfig = {
  type: CardType.PAGE,
  initialContent: () =>
    JSON.stringify({
      title: "",
      description: { type: "doc", content: [] },
    }),
  validateContent: (content: string) => {
    try {
      const parsed = JSON.parse(content);
      const titleEmpty = !parsed.title || parsed.title.trim() === "";
      const descriptionEmpty = isTiptapContentEmpty(
        JSON.stringify(parsed.description),
      );

      // Valid if at least ONE field has content
      if (titleEmpty && descriptionEmpty) {
        return { valid: false, error: "Page cannot be empty" };
      }

      return { valid: true };
    } catch {
      return { valid: false, error: "Invalid page content" };
    }
  },
  formatForSave: (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify({
        title: parsed.title || "",
        description: parsed.description || { type: "doc", content: [] },
      });
    } catch {
      return JSON.stringify({
        title: "",
        description: { type: "doc", content: [] },
      });
    }
  },
  isEmpty: (content: string) => {
    try {
      const parsed = JSON.parse(content);
      const titleEmpty = !parsed.title || parsed.title.trim() === "";
      const descriptionEmpty = isTiptapContentEmpty(
        JSON.stringify(parsed.description),
      );
      return titleEmpty && descriptionEmpty;
    } catch {
      return true;
    }
  },
  messages: {
    createSuccess: "Page created successfully",
    updateSuccess: "Page updated successfully",
    createError: "Failed to create page",
    updateError: "Failed to update page",
  },
};

/**
 * Placeholder config for card types not yet fully implemented
 * These will throw an error if used, prompting implementation
 */
const createPlaceholderConfig = (type: CardType): CardTypeConfig => ({
  type,
  initialContent: () => JSON.stringify({}),
  validateContent: () => ({ valid: true }),
  formatForSave: (content: string) => content,
  isEmpty: isTiptapContentEmpty,
  messages: {
    createSuccess: `${type} created successfully`,
    updateSuccess: `${type} updated successfully`,
    createError: `Failed to create ${type.toLowerCase()}`,
    updateError: `Failed to update ${type.toLowerCase()}`,
  },
});

/**
 * Card Type Registry
 * Add new card types here as they are created
 */
export const cardTypeRegistry: Record<CardType, CardTypeConfig> = {
  [CardType.TEXT]: textCardConfig,
  [CardType.PAGE]: pageCardConfig,
  [CardType.LINK]: linkCardConfig,
  // Future card types (placeholder configs):
  [CardType.TODO]: createPlaceholderConfig(CardType.TODO),
  [CardType.IMAGE]: createPlaceholderConfig(CardType.IMAGE),
  [CardType.COLUMN]: createPlaceholderConfig(CardType.COLUMN),
  [CardType.SUBBOARD]: createPlaceholderConfig(CardType.SUBBOARD),
};

/**
 * Get card type configuration
 */
export const getCardTypeConfig = (type: CardType): CardTypeConfig => {
  const config = cardTypeRegistry[type];
  if (!config) {
    throw new Error(`Unknown card type: ${type}`);
  }
  return config;
};
