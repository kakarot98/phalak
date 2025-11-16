import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with Project, Folder, and Board data...\n')

  // Step 1: Create project
  const project = await prisma.project.create({
    data: {
      name: 'Film Production Project',
      description: 'Storyboard and character development for animated short',
    },
  })

  // Step 2: Create folders
  const characterFolder = await prisma.folder.create({
    data: {
      name: 'Character Design',
      description: 'All character-related boards',
      projectId: project.id,
    },
  })

  const storyFolder = await prisma.folder.create({
    data: {
      name: 'Story Development',
      description: 'Plot, structure, and themes',
      projectId: project.id,
    },
  })

  const actFolder = await prisma.folder.create({
    data: {
      name: 'Act Structure',
      description: 'Three-act breakdown',
      projectId: project.id,
      parentFolderId: storyFolder.id,
    },
  })

  // Step 3: Create boards with cards
  await prisma.board.create({
    data: {
      name: 'Main Characters',
      description: 'Protagonist and antagonist development',
      projectId: project.id,
      folderId: characterFolder.id,
      cards: {
        create: [
          {
            type: 'TEXT',
            title: 'Protagonist: Maya',
            content: JSON.stringify({
              richText: 'A curious 12-year-old inventor who discovers a magical workshop. Bold, creative, sometimes reckless.',
              source: 'Character bible v1.2'
            }),
            positionX: 100,
            positionY: 100,
            width: 280,
            color: '#ff6b6b',
          },
          {
            type: 'TEXT',
            title: 'Antagonist: The Collector',
            content: JSON.stringify({
              richText: 'An obsessive curator who wants to preserve magical items forever, even if it means trapping their magic.',
              source: 'Character bible v1.2'
            }),
            positionX: 420,
            positionY: 100,
            width: 280,
            color: '#a29bfe',
          },
        ],
      },
    },
  })

  await prisma.board.create({
    data: {
      name: 'Supporting Cast',
      description: 'Secondary characters',
      projectId: project.id,
      folderId: characterFolder.id,
      cards: {
        create: [
          {
            type: 'TEXT',
            title: 'Mentor: Gearsmith',
            content: JSON.stringify({
              richText: 'The old workshop owner who left behind cryptic notes. Appears only in flashbacks.',
            }),
            positionX: 100,
            positionY: 100,
            width: 280,
            color: '#fdcb6e',
          },
        ],
      },
    },
  })

  await prisma.board.create({
    data: {
      name: 'Three Acts',
      description: 'Main story beats',
      projectId: project.id,
      folderId: actFolder.id,
      cards: {
        create: [
          {
            type: 'TEXT',
            title: 'Act 1: Discovery',
            content: JSON.stringify({
              richText: 'Maya finds the abandoned workshop. Discovers her first magical tool. Accidentally activates the Collector\'s alarm.',
            }),
            positionX: 100,
            positionY: 100,
            width: 280,
          },
          {
            type: 'TEXT',
            title: 'Act 2: Conflict',
            content: JSON.stringify({
              richText: 'The Collector arrives. Maya must use her inventions to protect the workshop. She learns about Gearsmith\'s past.',
            }),
            positionX: 420,
            positionY: 100,
            width: 280,
          },
          {
            type: 'TEXT',
            title: 'Act 3: Resolution',
            content: JSON.stringify({
              richText: 'Maya realizes magic belongs in motion, not in glass cases. She defeats the Collector by sharing the magic with her community.',
            }),
            positionX: 740,
            positionY: 100,
            width: 280,
          },
        ],
      },
    },
  })

  await prisma.board.create({
    data: {
      name: 'Themes & Messages',
      description: 'Core themes',
      projectId: project.id,
      folderId: storyFolder.id,
      cards: {
        create: [
          {
            type: 'TEXT',
            title: 'Key Themes',
            content: JSON.stringify({
              richText: 'Creativity vs. Control\nSharing vs. Hoarding\nGrowth through making mistakes',
            }),
            positionX: 100,
            positionY: 100,
            width: 280,
            color: '#74b9ff',
          },
        ],
      },
    },
  })

  await prisma.board.create({
    data: {
      name: 'Visual Reference',
      description: 'Moodboard and style inspiration',
      projectId: project.id,
      cards: {
        create: [
          {
            type: 'TEXT',
            title: 'Art Direction Notes',
            content: JSON.stringify({
              richText: 'Steampunk meets whimsy. Warm color palette. Hand-drawn textures mixed with geometric precision.',
            }),
            positionX: 100,
            positionY: 100,
            width: 300,
          },
        ],
      },
    },
  })

  console.log('✅ Created project:', project.name)
  console.log('✅ Seeding completed successfully!\n')
  console.log('📁 Structure:')
  console.log('   Project: Film Production Project')
  console.log('   ├── Folder: Character Design')
  console.log('   │   ├── Board: Main Characters')
  console.log('   │   └── Board: Supporting Cast')
  console.log('   ├── Folder: Story Development')
  console.log('   │   ├── Folder: Act Structure')
  console.log('   │   │   └── Board: Three Acts')
  console.log('   │   └── Board: Themes & Messages')
  console.log('   └── Board: Visual Reference (root level)\n')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
