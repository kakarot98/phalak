import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with Card-based data...\n')

  // Create sample workspace with boards and cards
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Film Production Project',
      description: 'Storyboard and character development for animated short',
      boards: {
        create: [
          {
            name: 'Character Development',
            description: 'Main characters, personalities, and arcs',
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
                {
                  type: 'TEXT',
                  title: 'Mentor: Gearsmith',
                  content: JSON.stringify({
                    richText: 'The old workshop owner who left behind cryptic notes. Appears only in flashbacks.',
                  }),
                  positionX: 740,
                  positionY: 100,
                  width: 280,
                  color: '#fdcb6e',
                },
              ],
            },
          },
          {
            name: 'Story Structure',
            description: 'Three-act structure and key beats',
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
                {
                  type: 'TEXT',
                  title: 'Key Themes',
                  content: JSON.stringify({
                    richText: 'Creativity vs. Control\nSharing vs. Hoarding\nGrowth through making mistakes',
                  }),
                  positionX: 100,
                  positionY: 400,
                  width: 280,
                  color: '#74b9ff',
                },
              ],
            },
          },
          {
            name: 'Visual Reference',
            description: 'Moodboard and style inspiration',
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
        ],
      },
    },
  })

  console.log('✅ Created workspace:', workspace.name)
  console.log('✅ Seeding completed successfully!\n')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
