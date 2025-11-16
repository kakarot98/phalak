import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cards/:id - Get single card
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const card = await prisma.card.findUnique({
      where: { id },
    })

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error fetching card:', error)
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    )
  }
}

// PATCH /api/cards/:id - Update card (including position for drag-and-drop)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      type,
      title,
      content,
      positionX,
      positionY,
      width,
      height,
      zIndex,
      color,
      linkedBoardId,
    } = body

    // Validate at least one field is provided
    if (
      type === undefined &&
      title === undefined &&
      content === undefined &&
      positionX === undefined &&
      positionY === undefined &&
      width === undefined &&
      height === undefined &&
      zIndex === undefined &&
      color === undefined &&
      linkedBoardId === undefined
    ) {
      return NextResponse.json(
        { error: 'At least one field must be provided' },
        { status: 400 }
      )
    }

    // Build update data object
    const updateData: any = {}

    if (type !== undefined) updateData.type = type
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (positionX !== undefined) updateData.positionX = positionX
    if (positionY !== undefined) updateData.positionY = positionY
    if (width !== undefined) updateData.width = width
    if (height !== undefined) updateData.height = height
    if (zIndex !== undefined) updateData.zIndex = zIndex
    if (color !== undefined) updateData.color = color
    if (linkedBoardId !== undefined) updateData.linkedBoardId = linkedBoardId

    const card = await prisma.card.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(card)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      )
    }
    console.error('Error updating card:', error)
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    )
  }
}

// DELETE /api/cards/:id - Delete card
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.card.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      )
    }
    console.error('Error deleting card:', error)
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    )
  }
}
