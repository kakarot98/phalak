import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/boards/:id/cards - List cards in a board
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const cards = await prisma.card.findMany({
      where: { boardId: id },
      orderBy: { zIndex: 'asc' },
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    )
  }
}

// POST /api/boards/:id/cards - Create card in board
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: boardId } = await params
    const body = await request.json()
    const { type, title, content, positionX, positionY, width, height, color } = body

    // Validate required fields
    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { error: 'Type is required and must be a string' },
        { status: 400 }
      )
    }

    if (positionX === undefined || positionY === undefined) {
      return NextResponse.json(
        { error: 'Position (positionX, positionY) is required' },
        { status: 400 }
      )
    }

    // Verify board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // Get the highest zIndex to place new card on top
    const highestCard = await prisma.card.findFirst({
      where: { boardId },
      orderBy: { zIndex: 'desc' },
      select: { zIndex: true },
    })

    const card = await prisma.card.create({
      data: {
        type,
        title: title || null,
        content: content || null,
        positionX,
        positionY,
        width: width || 280,
        height: height || null,
        zIndex: highestCard ? highestCard.zIndex + 1 : 0,
        color: color || null,
        boardId,
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    )
  }
}
