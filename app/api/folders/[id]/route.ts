import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/folders/:id - Get folder with its contents (subfolders and boards)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        subFolders: {
          orderBy: { updatedAt: 'desc' },
          include: {
            _count: {
              select: {
                boards: true,
                subFolders: true,
              },
            },
          },
        },
        boards: {
          orderBy: { updatedAt: 'desc' },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        parentFolder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Error fetching folder:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folder' },
      { status: 500 }
    )
  }
}

// PATCH /api/folders/:id - Update folder
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, parentFolderId } = body

    // Validate at least one field is provided
    if (!name && description === undefined && parentFolderId === undefined) {
      return NextResponse.json(
        { error: 'At least one field must be provided' },
        { status: 400 }
      )
    }

    // Validate name if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Name must be a non-empty string' },
        { status: 400 }
      )
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(parentFolderId !== undefined && { parentFolderId }),
      },
    })

    return NextResponse.json(folder)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }
    console.error('Error updating folder:', error)
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    )
  }
}

// DELETE /api/folders/:id - Delete folder (cascades to subfolders and boards)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.folder.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }
    console.error('Error deleting folder:', error)
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    )
  }
}