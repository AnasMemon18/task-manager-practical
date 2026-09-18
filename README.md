# Task Manager

A single-page task manager built with React, TypeScript, and Material UI. Features email/password auth, task CRUD with optimistic updates, drag-and-drop Kanban, URL-synced filters, sorting, pagination, and unit tests.

**Repository:** https://github.com/AnasMemon18/task-manager-practical

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast dev server, TS-first, minimal config. |
| Language | **TypeScript (strict)** | `noImplicitAny`, `noUnusedLocals`, `noUncheckedIndexedAccess` all on. |
| UI | **Material UI v7** | Responsive components, accessibility defaults, theme system. |
| Forms | **React Hook Form + Zod** | Uncontrolled inputs (no re-render per keystroke); Zod schema is the single source of truth for validation and types via `z.infer`. |
| State | **React Context + useReducer** | Scope is small enough that Context is sufficient. Reducers are pure and testable. |
| Routing | **React Router v7** | Standard, supports layout routes for auth guards. |
| Drag & Drop | **@dnd-kit** | Modern, TypeScript-first, keyboard-accessible. |
| Testing | **Jest + React Testing Library** | Standard for React; RTL encourages tests that mirror user behavior. |
| Lint / Format | **ESLint + Prettier** | Enforced via scripts; no unformatted code lands. |

---

## Setup & Run

Requires **Node 18+**.

```bash
npm install
npm run dev