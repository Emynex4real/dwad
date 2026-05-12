# Project Standards & AI Core Memory

## 1. Project Context

- **App Name:** dwad
- **Domain:** Frontend-only React SPA.
- **Scope:** This repository is **frontend only**. There is no `server/` directory. All backend communication is done via external APIs consumed from the frontend.
- **Goal:** Clean, type-safe, performant React UI with strict TypeScript discipline.

---

## 2. Tech Stack & Boundaries

### Frontend (React SPA)

| Concern | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 (strict mode) — `.ts` / `.tsx` only, never `.js` / `.jsx` |
| Bundler | Vite 8 |
| Module format | ESM (`"type": "module"`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` plugin |
| Routing | _(not yet added — update when chosen)_ |
| State | _(not yet added — update when chosen)_ |
| Testing | _(not yet added — update when chosen)_ |

> **Rule:** Before adding any library, confirm it has TypeScript types (`@types/` or bundled `.d.ts`). Do not add untyped dependencies.

### TypeScript Configuration

- **Target:** `es2023`
- **Module resolution:** `bundler`
- **Strict flags in effect:** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`, `verbatimModuleSyntax`
- `skipLibCheck: true` — do not disable this; it suppresses noise from third-party types
- `noEmit: true` — Vite handles transpilation; `tsc` is type-check only

### Scripts

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check then bundle for production
npm run lint       # ESLint (typescript-eslint + react-hooks + react-refresh)
npm run preview    # Serve the production build locally
```

---

## 3. Architecture & Directory Structure

```
src/
├── assets/         # Static assets (images, fonts, svgs)
├── components/     # React components, organized by feature domain
│   └── ui/         # Reusable primitives (Button, Input, Modal, etc.)
├── contexts/       # React Context providers (one file per domain)
├── hooks/          # Custom React hooks (use* prefix)
├── layouts/        # Page-level layout wrappers
├── pages/          # Route-level page components
├── routes/         # Route definitions and guards
├── services/       # API client modules (one file per domain)
├── types/          # Shared TypeScript types and interfaces
├── utils/          # Pure utility functions (no side effects)
├── App.tsx         # Root component, router, global providers
├── main.tsx        # Entry point — ReactDOM.createRoot only
└── index.css       # Global styles / CSS reset
```

> **Rule:** When adding a new directory not listed here, document it in this file before committing.

---

## 4. AI Workflow Directives

- **Audit Before Acting:** Read the relevant source files before generating code. Never assume a function, type, or component exists without verifying it in the file tree.
- **Plan First:** For any change touching 2+ files or introducing new logic, write a brief plan and get user approval before writing code.
- **Brevity in Output:** Do not output full files when only a small block changed. Show the changed block with ~5 lines of context above and below.
- **No Placeholders:** Never use `// ...existing code...` as a shorthand in a way that would break the app if copy-pasted. Be explicit.
- **Scope Discipline:** Implement exactly what is requested. Do not refactor unrelated code, rename variables for style, or add "nice to have" abstractions.
- **No Speculative Code:** Do not add error handling, fallbacks, or abstractions for scenarios that do not yet exist. Three similar lines is better than a premature abstraction.
- **No Comments for the Obvious:** Only add a comment when the *why* is non-obvious — a hidden constraint, a workaround, a subtle invariant. Never comment on what the code does.
- **Self-Learn:** When corrected, fix the error AND append a bullet to the Lessons Learned ledger in Section 7.

---

## 5. TypeScript Standards

- **No `any`.** If the type is genuinely unknown, use `unknown` and narrow it explicitly.
- **No type assertions (`as X`)** unless you can justify in a comment why narrowing is impossible.
- **Prefer `interface` over `type` for object shapes** — only use `type` for unions, intersections, and aliases.
- **Avoid `enum`.** Use `as const` objects with a derived union type instead:
  ```ts
  const Role = { Admin: 'admin', Student: 'student' } as const;
  type Role = typeof Role[keyof typeof Role];
  ```
- **`verbatimModuleSyntax` is on.** Always use `import type` for type-only imports:
  ```ts
  import type { FC } from 'react';
  ```
- **All exported functions and component props must be explicitly typed.** Inferred return types on non-trivial functions are acceptable only when immediately obvious.
- **Shared types go in `src/types/`.** Component-local types can be co-located in the component file.

---

## 6. Component Standards

- **Functional components only.** No class components.
- **One component per file.** Sub-components used only within a parent can be co-located, but extract them if they grow beyond ~30 lines.
- **Prop naming:** be descriptive. `userData` not `data`. `isLoading` not `loading` for booleans.
- **Props interface naming:** `ComponentNameProps` — e.g., `ButtonProps`.
- **No inline styles.** All styling is done with Tailwind utility classes. Never use `style={{}}` props unless a value is genuinely dynamic and cannot be expressed as a class (e.g., a JS-computed pixel value). In that case, prefer a CSS variable set via `style` and consumed in a class.
- **No direct DOM manipulation.** Use refs only when the React model genuinely cannot handle the task.
- **`key` prop:** always use stable, unique IDs — never array indices for dynamic lists.

---

## 7. State & Data Fetching Standards

- **Lift state only as far as it needs to go.** Local state stays local. Cross-feature state goes into Context.
- **One Context per domain.** Name the file and export: `AuthContext`, `ThemeContext`, etc.
- **All API calls go through `src/services/`.** Components never call `fetch`/`axios` directly.
- **Service modules are plain async functions** — no classes, no singletons unless there is a specific reason.
- **Environment variables:**
  - Prefix all Vite-exposed vars with `VITE_`.
  - Never commit `.env.local`. Maintain a `.env.example` with every required key (no values).
  - Access via `import.meta.env.VITE_*` — never `process.env`.

---

## 8. Performance Standards

- **Code-split at the route level** using `React.lazy()` + `Suspense`. Every page component in `src/pages/` should be lazy-loaded.
- **Minimize `useEffect`.** Prefer derived state, `useMemo`, and `useCallback` where appropriate.
- **`useCallback` / `useMemo` only when profiling proves benefit** or when a stable reference is required (e.g., passed to a memoized child). Do not add them preemptively.
- **Images:** use correct formats (WebP/AVIF), set explicit `width` and `height` to prevent layout shift.

---

## 9. Tailwind CSS Standards

- **Version:** Tailwind CSS v4. There is **no `tailwind.config.js`** — configuration is done via CSS (`@theme`, `@plugin`) inside `src/index.css`.
- **Import:** Tailwind is loaded via `@import "tailwindcss"` at the top of `src/index.css`. Do not add it anywhere else.
- **Vite plugin:** `@tailwindcss/vite` is registered in `vite.config.ts`. Do not install or configure `postcss` separately — the plugin replaces it.
- **Inline CSS → Tailwind conversion rules:**
  - Replace all `style={{}}` props with equivalent utility classes.
  - Map spacing (`margin`, `padding`) to `m-*` / `p-*` scale.
  - Map colors to Tailwind palette or CSS variables via `text-[var(--token)]` / `bg-[var(--token)]` syntax when using project design tokens.
  - Map `display`, `flexbox`, `grid` properties to their utility equivalents (`flex`, `grid`, `items-center`, etc.).
  - Responsive breakpoints use Tailwind prefixes (`sm:`, `md:`, `lg:`) — not raw media queries in component files.
  - When a one-off value has no Tailwind equivalent, use the arbitrary value syntax: `w-[123px]`, `text-[#aa3bff]`.
- **No mixing:** Do not mix Tailwind classes with inline styles on the same element. Pick one — Tailwind wins.
- **Class order:** Follow the Prettier Tailwind plugin order (layout → box model → typography → visual → interactive) for readability. Not enforced by tooling yet — apply manually.

---

## 10. Code Quality & Conventions

- **Linting:** ESLint with `typescript-eslint` (strict), `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`. Fix lint errors before marking a task done — do not suppress with `eslint-disable` comments unless absolutely necessary (and always add a reason comment).
- **No `console.log` in committed code.** Remove all debug logging before finishing a task.
- **Imports:** absolute path aliases are not yet configured. Use relative paths until a `paths` alias is added to `tsconfig.app.json` and `vite.config.ts`. When aliases are added, update this rule.
- **File naming:** `PascalCase` for components (`UserCard.tsx`), `camelCase` for everything else (`useAuth.ts`, `auth.service.ts`).

---

## 11. [LESSONS LEARNED] — The AI Correction Ledger

_Agent Instructions: Append a new bullet point here immediately after making a mistake and receiving a correction from the user. Format: **[YYYY-MM-DD] — [Topic]:** Rule._

- **[2026-05-11] — Baseline:** Initialized standards and self-learning protocol for this project. Frontend-only scope confirmed.
