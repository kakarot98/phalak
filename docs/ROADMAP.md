# Phalakam Development Roadmap

**Project Goal:** Build a lightweight Milanote clone for visual creative work

**Target Use Cases:**
- Story planning and character development
- Visual moodboards and concept art collections
- Project planning with spatial organization
- Storyboarding and narrative structure mapping

---

## 🎯 Multi-Session Implementation Plan

### **Session 1: Database Foundation** ✅ COMPLETE
**Status:** Complete
**Date:** November 15, 2025

**Completed:**
- ✅ Redesigned schema from Note → Card model
- ✅ Added CardType enum (TEXT, TODO, IMAGE, LINK, COLUMN, SUBBOARD)
- ✅ Created TypeScript type system
- ✅ Updated Connection model with proper relations
- ✅ Created realistic seed data
- ✅ Database successfully migrated

**Deliverables:**
- `prisma/schema.prisma` - Complete Card-based schema
- `types/card.ts` - Full type definitions
- `prisma/seed.ts` - Film production example data
- `docs/SESSION-1-DATABASE-FOUNDATION.md` - Session documentation

---

### **Session 2: Infinite Canvas System** 🔜 NEXT
**Estimated Time:** 2-3 hours
**Dependencies:** Session 1

**Goals:**
1. Install and configure @dnd-kit
2. Build infinite canvas with pan/zoom
3. Implement drag-and-drop for cards
4. Replace grid layout with canvas

**Tasks:**
- [ ] Install @dnd-kit packages
  ```bash
  npm install @dnd-kit/core @dnd-kit/utilities @dnd-kit/modifiers
  ```

- [ ] Create canvas infrastructure
  - [ ] `components/canvas/BoardCanvas.tsx` - Main canvas container
  - [ ] `components/canvas/CanvasViewport.tsx` - Pan/zoom wrapper
  - [ ] `components/canvas/CanvasCard.tsx` - Draggable card wrapper
  - [ ] `components/canvas/CanvasToolbar.tsx` - Zoom controls

- [ ] Update board page
  - [ ] Replace `app/boards/[id]/page.tsx` with canvas
  - [ ] Implement pan (drag background)
  - [ ] Implement zoom (mouse wheel)
  - [ ] Position cards absolutely using `positionX`/`positionY`

- [ ] Test positioning
  - [ ] Drag cards to new positions
  - [ ] Update positions in database
  - [ ] Persist positions across page reloads

**Deliverables:**
- Working infinite canvas
- Draggable cards with persistence
- Pan and zoom controls
- Session documentation

---

### **Session 3: Text Card Type**
**Estimated Time:** 2-3 hours
**Dependencies:** Session 2

**Goals:**
1. Install Slate rich text editor
2. Build TextCard component
3. Implement inline editing
4. Add color coding UI

**Tasks:**
- [ ] Install Slate
  ```bash
  npm install slate slate-react slate-history
  ```

- [ ] Create TextCard component
  - [ ] `components/cards/TextCard.tsx`
  - [ ] Rich text editor with Slate
  - [ ] Inline editing (click to edit)
  - [ ] Auto-save on blur

- [ ] Add color strip UI
  - [ ] Color picker in card header
  - [ ] Apply color to card border/strip
  - [ ] Persist color in `Card.color` field

- [ ] Update API
  - [ ] Validate TEXT card content structure
  - [ ] Handle rich text in JSON format

- [ ] Polish UX
  - [ ] Smooth transitions
  - [ ] Focus management
  - [ ] Keyboard shortcuts (Cmd+Enter to finish)

**Deliverables:**
- Functional TextCard with rich text
- Color coding system
- Inline editing UX
- Session documentation

---

### **Session 4: Image Card Type**
**Estimated Time:** 2-3 hours
**Dependencies:** Session 3

**Goals:**
1. Implement file upload system
2. Build ImageCard component
3. Add image preview and lightbox
4. Implement resize handles

**Tasks:**
- [ ] Set up file storage
  - [ ] Create `public/uploads/` directory
  - [ ] Add to `.gitignore`
  - [ ] Create upload API endpoint

- [ ] Create ImageCard component
  - [ ] `components/cards/ImageCard.tsx`
  - [ ] Image upload button
  - [ ] Preview thumbnail
  - [ ] Lightbox on click

- [ ] Add resize functionality
  - [ ] Resize handles on corners
  - [ ] Maintain aspect ratio
  - [ ] Update `width` and `height` in database

- [ ] Handle file metadata
  - [ ] Store filename, path, dimensions
  - [ ] Optional caption field

**Deliverables:**
- Working image upload
- ImageCard with preview
- Resize functionality
- Session documentation

---

### **Session 5: Additional Card Types**
**Estimated Time:** 3-4 hours
**Dependencies:** Session 4

**Goals:**
1. Implement TodoCard
2. Implement LinkCard with preview
3. Add card type selector

**Tasks:**
- [ ] TodoCard
  - [ ] Checklist with items
  - [ ] Add/remove items inline
  - [ ] Check/uncheck functionality
  - [ ] Progress indicator

- [ ] LinkCard
  - [ ] URL input
  - [ ] Fetch preview metadata (title, description, thumbnail)
  - [ ] Toggle preview display
  - [ ] Clickable link

- [ ] Card type selector
  - [ ] Sidebar with card type buttons
  - [ ] "Add Card" dropdown
  - [ ] Create card of specific type

**Deliverables:**
- TodoCard and LinkCard components
- Card type creation UI
- Session documentation

---

### **Session 6: Columns & Sub-boards**
**Estimated Time:** 3-4 hours
**Dependencies:** Session 5

**Goals:**
1. Implement Column cards (vertical containers)
2. Implement Sub-board cards (nested boards)
3. Add drag-into-column functionality

**Tasks:**
- [ ] ColumnCard
  - [ ] Vertical container component
  - [ ] Drag cards into column
  - [ ] Reorder within column
  - [ ] Collapse/expand

- [ ] SubBoardCard
  - [ ] Link to another board
  - [ ] Click to navigate
  - [ ] Breadcrumb navigation
  - [ ] Board preview/thumbnail

- [ ] Drag interactions
  - [ ] Drop zones for columns
  - [ ] Visual feedback
  - [ ] Update parent relationships

**Deliverables:**
- ColumnCard with drag-into
- SubBoardCard with navigation
- Session documentation

---

### **Session 7: Connections (Arrows)**
**Estimated Time:** 3-4 hours
**Dependencies:** Session 6

**Goals:**
1. Implement SVG arrow rendering
2. Add connection creation UI
3. Enable connection editing/deletion

**Tasks:**
- [ ] Arrow rendering
  - [ ] SVG layer behind cards
  - [ ] Bezier curves for smooth paths
  - [ ] Arrow heads
  - [ ] Labels on arrows

- [ ] Connection mode
  - [ ] Toggle connection mode in toolbar
  - [ ] Click source → target to create
  - [ ] Visual feedback during creation

- [ ] Connection editing
  - [ ] Drag control points to adjust curve
  - [ ] Edit label
  - [ ] Delete connection

- [ ] Use Connection model
  - [ ] CRUD API for connections
  - [ ] Persist style, color, label

**Deliverables:**
- Visual arrow connections
- Connection creation UI
- Session documentation

---

### **Session 8: UX Polish & Templates**
**Estimated Time:** 2-3 hours
**Dependencies:** Session 7

**Goals:**
1. Build comprehensive toolbar
2. Add sidebar with card types
3. Implement templates
4. Polish interactions

**Tasks:**
- [ ] Toolbar
  - [ ] Zoom in/out buttons
  - [ ] Fit to screen
  - [ ] Grid toggle
  - [ ] Connection mode toggle

- [ ] Sidebar
  - [ ] Card type buttons with icons
  - [ ] Drag card types onto canvas
  - [ ] Templates section

- [ ] Templates
  - [ ] Storyboard template
  - [ ] Character development template
  - [ ] Moodboard template
  - [ ] Custom templates

- [ ] Keyboard shortcuts
  - [ ] Delete: Remove card
  - [ ] Cmd/Ctrl+Z: Undo
  - [ ] Cmd/Ctrl+C/V: Copy/paste
  - [ ] Escape: Deselect

- [ ] Context menus
  - [ ] Right-click on card
  - [ ] Delete, duplicate, change color

**Deliverables:**
- Polished toolbar and sidebar
- Template system
- Keyboard shortcuts
- Session documentation

---

### **Session 9: Multi-select & Advanced Interactions**
**Estimated Time:** 2-3 hours
**Dependencies:** Session 8

**Goals:**
1. Multi-select cards
2. Group operations
3. Alignment tools

**Tasks:**
- [ ] Multi-select
  - [ ] Shift+click to add to selection
  - [ ] Drag rectangle to select multiple
  - [ ] Visual selection indicator

- [ ] Group operations
  - [ ] Move selected cards together
  - [ ] Delete multiple cards
  - [ ] Change color for selection

- [ ] Alignment tools
  - [ ] Align left/right/center
  - [ ] Distribute horizontally/vertically
  - [ ] Equal spacing

**Deliverables:**
- Multi-select functionality
- Alignment tools
- Session documentation

---

### **Session 10: Collaboration (Future)**
**Estimated Time:** TBD
**Dependencies:** Session 9

**Goals:**
1. Add user authentication
2. Implement real-time sync
3. Add comments and cursors

**Tasks:**
- [ ] Auth system (NextAuth.js or Clerk)
- [ ] Activate User model
- [ ] Real-time sync (WebSockets or Partykit)
- [ ] User cursors
- [ ] Comments on cards
- [ ] Share permissions

---

## 📊 Progress Tracking

### Overall Status: 10% Complete

| Session | Status | Progress |
|---------|--------|----------|
| 1. Database Foundation | ✅ Complete | 100% |
| 2. Infinite Canvas | 🔜 Next | 0% |
| 3. Text Cards | ⏸️ Pending | 0% |
| 4. Image Cards | ⏸️ Pending | 0% |
| 5. Additional Card Types | ⏸️ Pending | 0% |
| 6. Columns & Sub-boards | ⏸️ Pending | 0% |
| 7. Connections | ⏸️ Pending | 0% |
| 8. UX Polish | ⏸️ Pending | 0% |
| 9. Multi-select | ⏸️ Pending | 0% |
| 10. Collaboration | ⏸️ Future | 0% |

---

## 🎨 Design Principles

1. **Lightweight First** - Performance over features
2. **Visual Spatial** - Embrace the canvas metaphor
3. **Low Friction** - Click, drag, type - no complex menus
4. **Creative-Focused** - Designed for storytelling and visual work
5. **Progressive Enhancement** - Start simple, add complexity gradually

---

## 🔧 Technology Choices

- **Framework:** Next.js 15 (App Router)
- **Database:** Prisma + SQLite → PostgreSQL
- **Drag-and-Drop:** @dnd-kit
- **Rich Text:** Slate (stable, lightweight)
- **File Storage:** Local filesystem → Cloud later
- **UI Library:** Ant Design
- **Styling:** CSS Modules + Ant Design theme

---

## 📝 Notes

- Each session should take 2-4 hours
- Sessions are independent and can be done on different days
- Documentation is created after each session
- All changes are tested before moving to next session
- User feedback can adjust the roadmap

---

**Last Updated:** November 15, 2025
**Next Session:** Session 2 - Infinite Canvas System
