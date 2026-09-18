# Task Manager

A single-page task manager built with React, TypeScript, and Material UI. Features email/password auth, task CRUD with optimistic updates, drag-and-drop Kanban, URL-synced filters, sorting, pagination, and unit tests.

**Repository:** https://github.com/AnasMemon18/task-manager-practical

---

## Tech Stack

| Layer         | Choice                           | Why                                                                                                                                |
| ------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Build tool    | **Vite**                         | Fast dev server, TS-first, minimal config.                                                                                         |
| Language      | **TypeScript (strict)**          | `noImplicitAny`, `noUnusedLocals`, `noUncheckedIndexedAccess` all on.                                                              |
| UI            | **Material UI v7**               | Responsive components, accessibility defaults, theme system.                                                                       |
| Forms         | **React Hook Form + Zod**        | Uncontrolled inputs (no re-render per keystroke); Zod schema is the single source of truth for validation and types via `z.infer`. |
| State         | **React Context + useReducer**   | Scope is small enough that Context is sufficient. Reducers are pure and testable.                                                  |
| Routing       | **React Router v7**              | Standard, supports layout routes for auth guards.                                                                                  |
| Drag & Drop   | **@dnd-kit**                     | Modern, TypeScript-first, keyboard-accessible.                                                                                     |
| Testing       | **Jest + React Testing Library** | Standard for React; RTL encourages tests that mirror user behavior.                                                                |
| Lint / Format | **ESLint + Prettier**            | Enforced via scripts; no unformatted code lands.                                                                                   |

---

## Setup & Run

Requires **Node 18+**.

```bash
Initial run:
npm install
npm run dev
Open the printed URL (typically http://localhost:5173)
---
To run tests:
npm test

To build for production:
npm run build

----------

Testing
bash
npm test
Three test files, 21 tests, all passing:

----------

--- Folder Structure
src/
├── components/
│   ├── auth/                    # LoginForm, SignupForm, route guards
│   ├── tasks/                   # TaskCard, TaskList, TaskForm, TaskFilters,
│   │                            #   TaskPagination, TaskBoard (DnD), etc.
│   └── ui/                      # Reusable primitives: LoadingState,
│                                #   EmptyState, ErrorState, ConfirmDialog
├── context/
│   ├── AuthContext.tsx          # User session state + auth actions
│   └── TasksContext.tsx         # Task list state + CRUD actions
├── hooks/
│   ├── useAuth.ts               # Typed context consumer
│   ├── useTasks.ts              # Typed context consumer
│   ├── useDebounce.ts           # Delays value updates (search input)
│   ├── useFilteredTasks.ts      # Filter → sort → paginate pipeline
│   └── useUrlFilters.ts         # URL <-> filter state sync
├── pages/                       # LoginPage, SignupPage, TasksPage
├── routes/AppRoutes.tsx         # Route table with guards
├── services/
│   ├── storage.ts               # Thin localStorage wrapper
│   ├── authService.ts           # Signup/login/logout/session + SHA-256 hashing
│   └── taskService.ts           # Task CRUD, scoped per user
├── types/index.ts               # Domain types (Task, User, filters, sort)
├── utils/
│   ├── date.ts                  # isOverdue, formatDate
│   └── validation.ts            # Zod schemas (login, signup, task)
├── __tests__/                   # Jest unit + component tests
├── theme.ts                     # MUI theme (palette, typography, shape)
├── App.tsx                      # Provider composition
└── main.tsx                     # Entry point (BrowserRouter + StrictMode)

----------

--- Architecture
The app is built in four layers. Each layer has one job and talks only to the layer below it.

┌─────────────────────────────────────────────────────┐
│  UI  (components, pages)                            │
│    - Presentational: render markup, receive props   │
│    - No business logic inside JSX                   │
└─────────────────────────────────────────────────────┘
              ▲ props / callbacks
              ▼
┌─────────────────────────────────────────────────────┐
│  State  (context, hooks)                            │
│    - AuthContext, TasksContext (reducer + actions)  │
│    - useFilteredTasks, useUrlFilters, useDebounce   │
└─────────────────────────────────────────────────────┘
              ▲ actions
              ▼
┌─────────────────────────────────────────────────────┐
│  Services  (authService, taskService, storage)      │
│    - Pure persistence logic. No React.              │
│    - Swappable to a real HTTP API without UI churn. │
└─────────────────────────────────────────────────────┘
              ▲
              ▼
┌─────────────────────────────────────────────────────┐
│  Types & Utils  (types/, utils/)                    │
│    - Domain shapes, Zod schemas, date helpers.      │
└─────────────────────────────────────────────────────┘

----------
Key Design Decisions:
localStorage instead of a mock server. The interface is wrapped in services/, so swapping to HTTP later is a single-file change per service. A full mock server (MSW, json-server) would add setup cost without proportional value here.

SHA-256 password hashing via Web Crypto. Plaintext passwords never hit storage. This is not production-grade (no salt, fast hash) — a real backend would use bcrypt/argon2. The service layer is async so the eventual API swap is a no-op.

Per-user task isolation. Tasks live under tasks:<userId> keys. Logging in as a different user loads a different bucket. Cross-user data leakage is structurally impossible.

Optimistic delete with rollback. removeTask snapshots the task list, dispatches TASK_DELETED, persists, and rolls back on failure. Renders feel instant; the sad path is still correct.

Filters in the URL, sort in local state. The PDF requires filters to be shareable; sort is a display preference. ?status=Todo&priority=High survives refresh and can be shared. Sort does not, deliberately.

Overdue is a derived flag, not a status. Done tasks are never overdue. We compute isOverdue(task) at render time rather than mutating status — no timers, no race conditions.

Droppable IDs = status strings. useDroppable({ id: 'In Progress' }). So onDragEnd gets the new status directly from over.id, with no lookup table.

Debounced search input with URL round-trip. The search field holds local state so typing feels instant; a 300ms debounce pushes to the URL. A second effect syncs URL → input, so Clear-all and browser back work correctly.
```
