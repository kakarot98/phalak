import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/projects/:id - Get single project with folders and boards
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        folders: {
          where: { parentFolderId: null }, // Only root-level folders
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
          where: { folderId: null }, // Only boards at project root
          orderBy: { updatedAt: 'desc' },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/:id - Update project
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description } = body

    // Validate at least one field is provided
    if (!name && description === undefined) {
      return NextResponse.json(
        { error: 'At least one field (name or description) must be provided' },
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

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/:id - Delete project (cascades to folders, boards, and cards)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.project.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}