import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/boards - Create new board
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, projectId, folderId } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // If folderId is provided, verify it exists
    if (folderId) {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
      })

      if (!folder) {
        return NextResponse.json(
          { error: 'Folder not found' },
          { status: 404 }
        )
      }
    }

    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        projectId,
        folderId: folderId || null,
      },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    )
  }
}