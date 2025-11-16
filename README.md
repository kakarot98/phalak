# Nivita

> **Lightweight Milanote clone** - A visual workspace for creative projects, storytelling, and spatial organization using infinite canvas "phalakams".

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Session](https://img.shields.io/badge/session-2%2F10%20complete-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Vision

Nivita is an open-source, self-hostable alternative to Milanote, designed for:
- **Story planning** and character development
- **Visual moodboards** and concept art collections
- **Project planning** with spatial organization
- **Storyboarding** and narrative structure mapping

### What's a Phalakam?
A **phalakam** is an infinite canvas board where you can arrange cards spatially - like a digital corkboard for your ideas.

---

## ✨ Features (In Development)

### ✅ Session 1: Database Foundation (Complete)
- [x] Card-based system with 6 types: TEXT, TODO, IMAGE, LINK, COLUMN, SUBBOARD
- [x] Canvas positioning (positionX, positionY, width, height, zIndex)
- [x] Connection model for arrows between cards
- [x] TypeScript type system
- [x] Prisma + SQLite database

### ✅ Session 2: Infinite Canvas & Restructuring (Complete)
- [x] Infinite canvas with pan/zoom (@dnd-kit)
- [x] Drag-and-drop card positioning
- [x] Projects → Folders → Phalakams hierarchy
- [x] Infinitely nested folder support
- [x] Complete API layer (projects, folders, boards/cards)
- [x] Breadcrumb navigation with dynamic paths

### 🔜 Upcoming Sessions
- [ ] **Session 3:** Rich text editing (Slate)
- [ ] **Session 4:** Image uploads
- [ ] **Session 5:** Todo and Link cards
- [ ] **Session 6:** Columns and sub-boards
- [ ] **Session 7:** Visual connections/arrows
- [ ] **Session 8:** Templates and UX polish
- [ ] **Session 9:** Multi-select and alignment
- [ ] **Session 10:** Real-time collaboration

See [ROADMAP.md](docs/ROADMAP.md) for full development plan.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nivita.git
cd nivita

# Install dependencies
npm install

# Set up database
npx prisma db push
npx prisma generate

# Seed with sample data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Explore the Database

```bash
# Open Prisma Studio to view database
npx prisma studio
```

Navigate to `http://localhost:5555` to see the hierarchical structure:
- **Film Production Project** (root project)
  - **Character Design** folder → Main Characters phalakam, Character Arcs phalakam
  - **Story Development** folder
    - **Act Structure** sub-folder → Three Act Breakdown phalakam
    - **Themes & Messages** phalakam
  - **Visual Reference** phalakam (at project root)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | Prisma + SQLite (→ PostgreSQL later) |
| **UI Library** | Ant Design |
| **Drag & Drop** | @dnd-kit ✅ |
| **Rich Text** | Slate (upcoming) |
| **File Storage** | Local filesystem (→ Cloud later) |

---

## 📁 Project Structure

```
nivita/
├── app/                      # Next.js App Router
│   ├── api/                 # Backend API routes
│   │   ├── projects/        # Project CRUD endpoints
│   │   ├── folders/         # Folder CRUD endpoints
│   │   ├── boards/          # Board endpoints
│   │   └── cards/           # Card update endpoints
│   ├── projects/[id]/       # Project detail pages
│   ├── folders/[id]/        # Folder navigation pages
│   └── boards/[id]/         # Phalakam (infinite canvas) pages
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── canvas/             # Canvas components (BoardCanvas, CanvasCard)
│   └── cards/              # Card display components (TextCard, etc.)
├── types/                  # TypeScript type definitions
│   └── card.ts            # Card type system
├── lib/                    # Utilities
│   └── prisma.ts          # Database client
├── prisma/                # Database
│   ├── schema.prisma      # Database schema (Project→Folder→Board→Card)
│   ├── seed.ts            # Hierarchical seed data
│   └── migrations/        # Migration history
├── docs/                  # Documentation
│   ├── ROADMAP.md         # Full development plan
│   └── SESSION-*.md       # Session notes
└── theme/                # Ant Design theme
    └── themeConfig.ts
```

---

## 🎨 Card Types

| Type | Description | Status |
|------|-------------|--------|
| **TEXT** | Rich text notes with optional source | ✅ Schema ready |
| **TODO** | Checklist with items | ✅ Schema ready |
| **IMAGE** | Image upload with caption | ✅ Schema ready |
| **LINK** | Web link with preview | ✅ Schema ready |
| **COLUMN** | Vertical container for cards | ✅ Schema ready |
| **SUBBOARD** | Nested board reference | ✅ Schema ready |

---

## 🤝 Contributing

We're building this incrementally over multiple sessions. Each session adds a major feature.

### Development Workflow

1. **Pull latest changes**
   ```bash
   git pull origin master
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Follow existing code style
   - Update types in `types/card.ts`
   - Update documentation

4. **Test changes**
   ```bash
   npm run dev
   npx prisma studio
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Reference any issues
   - Describe changes
   - Wait for review

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📚 Documentation

- [**ROADMAP.md**](docs/ROADMAP.md) - Complete 10-session development plan
- [**Session 1**](docs/SESSION-1-DATABASE-FOUNDATION.md) - Database foundation notes
- **Card Types** - See `types/card.ts` for type definitions

---

## 🔒 Database

### Hierarchical Schema

```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  folders     Folder[]
  boards      Board[]
}

model Folder {
  id             String   @id @default(cuid())
  name           String
  projectId      String
  parentFolderId String?           // Enables infinite nesting

  project        Project  @relation(fields: [projectId])
  parentFolder   Folder?  @relation("SubFolders", fields: [parentFolderId])
  subFolders     Folder[] @relation("SubFolders")
  boards         Board[]
}

model Board {
  id          String   @id @default(cuid())
  name        String
  projectId   String
  folderId    String?              // Optional: can be at project root

  project     Project  @relation(fields: [projectId])
  folder      Folder?  @relation(fields: [folderId])
  cards       Card[]
}

model Card {
  id        String  @id @default(cuid())
  boardId   String
  type      String  // TEXT, TODO, IMAGE, LINK, COLUMN, SUBBOARD

  positionX Float   // Infinite canvas positioning
  positionY Float
  width     Float
  height    Float?
  zIndex    Int

  color     String?
  title     String?
  content   String? // JSON

  board            Board   @relation(fields: [boardId])
  linkedBoardId    String? // For SUBBOARD type
}
```

### Seed Data

The database comes pre-seeded with a hierarchical **Film Production Project** example:
- **Character Design** folder with character phalakams
- **Story Development** folder with nested **Act Structure** sub-folder
- **Visual Reference** phalakam at project root

Reset and re-seed anytime:
```bash
npx prisma migrate reset
```

---

## 🗺️ Current Status

**Phase:** Session 2 of 10 complete

**What's Working:**
- ✅ Hierarchical database (Projects → Folders → Phalakams → Cards)
- ✅ Infinite folder nesting with self-referencing relations
- ✅ Complete REST API layer (CRUD for all models)
- ✅ Infinite canvas with pan/zoom (@dnd-kit)
- ✅ Drag-and-drop card positioning with optimistic updates
- ✅ Dynamic breadcrumb navigation
- ✅ Type system for all 6 card types
- ✅ Seed data with realistic hierarchical structure

**Next Up (Session 3):**
- Rich text editing with Slate
- Enhanced text card formatting
- Improved content editing experience

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

Inspired by [Milanote](https://milanote.com) - an amazing visual workspace for creatives.

---

## 📧 Contact

For questions or collaboration:
- Open an issue
- Start a discussion
- Submit a pull request

---

**Built with ❤️ for creatives, storytellers, and visual thinkers.**
