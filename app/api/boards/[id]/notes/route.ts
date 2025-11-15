import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/boards/:id/notes - List notes in a board
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const notes = await prisma.note.findMany({
      where: { boardId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/boards/:id/notes - Create note in board
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: boardId } = await params
    const body = await request.json()
    const { title, body: noteBody, positionX, positionY } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (!noteBody || typeof noteBody !== 'string' || noteBody.trim().length === 0) {
      return NextResponse.json(
        { error: 'Body is required and must be a non-empty string' },
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

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        body: noteBody.trim(),
        positionX: positionX ?? null,
        positionY: positionY ?? null,
        boardId,
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
