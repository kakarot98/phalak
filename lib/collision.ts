import { Card } from '@/types/card';

/**
 * Default card height if not specified (for auto-height cards)
 * This is an approximation for cards that don't have a fixed height
 */
const DEFAULT_CARD_HEIGHT = 150;

/**
 * Check if two rectangles overlap using AABB collision detection
 */
function rectanglesOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

/**
 * Check if two cards overlap based on their positions and dimensions
 * Uses the actual width and height from the Card objects
 */
export function checkCardsOverlap(card1: Card, card2: Card): boolean {
  // Use actual card dimensions from the database
  // If height is not specified (auto-height), use a default
  const rect1 = {
    x: card1.positionX,
    y: card1.positionY,
    width: card1.width,
    height: card1.height || DEFAULT_CARD_HEIGHT
  };

  const rect2 = {
    x: card2.positionX,
    y: card2.positionY,
    width: card2.width,
    height: card2.height || DEFAULT_CARD_HEIGHT
  };

  return rectanglesOverlap(rect1, rect2);
}

/**
 * Find all cards that overlap with the given card
 * @param targetCard The card to check overlaps for
 * @param allCards All cards on the board
 * @returns Array of overlapping cards
 */
export function findOverlappingCards(targetCard: Card, allCards: Card[]): Card[] {
  return allCards.filter(
    card => card.id !== targetCard.id && checkCardsOverlap(targetCard, card)
  );
}

/**
 * Get the highest zIndex among overlapping cards
 * @param targetCard The card to check overlaps for
 * @param allCards All cards on the board
 * @returns The highest zIndex of overlapping cards, or null if no overlaps
 */
export function getHighestOverlappingZIndex(
  targetCard: Card,
  allCards: Card[]
): number | null {
  const overlappingCards = findOverlappingCards(targetCard, allCards);

  if (overlappingCards.length === 0) {
    return null;
  }

  return Math.max(...overlappingCards.map(card => card.zIndex));
}

/**
 * Check if the dragged card should update its zIndex
 * @param draggedCard The card being dragged (with new position)
 * @param allCards All cards on the board
 * @returns New zIndex if update is needed, null otherwise
 */
export function calculateNewZIndex(
  draggedCard: Card,
  allCards: Card[]
): number | null {
  const highestOverlappingZIndex = getHighestOverlappingZIndex(draggedCard, allCards);

  // Only update if there are overlapping cards with higher zIndex
  if (highestOverlappingZIndex !== null && highestOverlappingZIndex >= draggedCard.zIndex) {
    return highestOverlappingZIndex + 1;
  }

  return null;
}