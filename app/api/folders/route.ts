import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/folders - Create new folder
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, projectId, parentFolderId } = body

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

    // If parentFolderId is provided, verify it exists
    if (parentFolderId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: parentFolderId },
      })

      if (!parentFolder) {
        return NextResponse.json(
          { error: 'Parent folder not found' },
          { status: 404 }
        )
      }
    }

    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        projectId,
        parentFolderId: parentFolderId || null,
      },
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    )
  }
}