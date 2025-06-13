# starter-project-minimal vs. starter-project

## 1. Purpose & Scope
- **starter-project-minimal**: A bare‐bones teaching template illustrating only the core FlexNet JSX concepts (Maybe monad, functional composition, secure JSX, simple counter state). Ideal for quick prototypes and learning.
- **starter-project**: A comprehensive starter demonstrating the full FlexNet JSX framework: types, core functions, secure runtime, systems (render, state, events, effects), error handling, utilities, and a counter feature. Geared toward real‐world app scaffolding.

## 2. Project Structure

| Aspect            | starter-project-minimal                      | starter-project                                                          |
|-------------------|----------------------------------------------|---------------------------------------------------------------------------|
| Directory Layout  | `src/core/`, `src/features/counter/`, `public/` | `src/core/`, `src/functions/`, `src/security/`, `src/systems/`, `src/utils/`, `src/features/`, `tests/`, `public/` |
| Module System     | ES modules for core + feature only           | ES modules for entire framework plus bundled runtime entrypoint          |
| Tests             | None                                         | `tests/` directory with unit/integration tests                           |

## 3. Core Types
- **Minimal**: Implements only `Maybe` in `src/core/types/maybe.js` (Just, Nothing, fromNullable, map, getOrElse).
- **Full**: Implements `Maybe`, `Either`, and `Result` in `src/core/types/` with both instance methods and static helpers (map, chain, getOrElse/fold).

## 4. Core Functions
- **Minimal**: `compose` and `pipe` in `composition.js`.
- **Full**: `compose`, `pipe`, `curry` in `composition.js` plus `map`, `filter`, `reduce` in `transforms.js`.

## 5. Secure JSX Runtime
- **Minimal**: Simple `createElement` + `render` in `jsx.js` with basic text‐escape.
- **Full**: Robust `createElement`/`jsx`, `render` in `src/core/runtime`, using `Either`/`Result`, `sanitizeProps`, `validateElementType`, `safeDOMOperation`, and proper error handling.

## 6. Security Utilities
- **Minimal**: Relies on basic `escape` inside JSX runtime.
- **Full**: Dedicated `security/functions.js` with `escape`, `validateInput`, `urlValidator`, and `safeDOMOperation`, adhering to `security-practices.md`.

## 7. Rendering System
- **Minimal**: Direct DOM operations (clear + append).
- **Full**: Virtual DOM creation (`createVirtualDOM`), reconciliation (`reconcile`), patching (`patch`), and `renderPipeline` in `src/systems/render`.

## 8. State Management
- **Minimal**: Local `createStore` defined in the counter feature (subscription‐based).
- **Full**: `createStore` in `src/systems/state/store.js` with immutable updates and subscriber notifications.

## 9. Effects & Events
- **Minimal**: No effect or event systems.
- **Full**: `Effect` system (`Effect.of`, `map`, `chain`, `run`) and `createEffect` in `src/systems/effects`; `createEventBus` in `src/systems/events`.

## 10. Error Handling
- **Minimal**: None beyond basic console errors.
- **Full**: `createErrorBoundary`, global error handlers (`setupGlobalErrorHandler`), and secure logging (`errorLogger`) in `src/systems/errors`.

## 11. Utilities
- **Minimal**: None beyond core composition and `Maybe`.
- **Full**: `src/utils/array.js` safe array helpers (`head`, `tail`, `find`, `isEmpty`, `safeGet`).

## 12. Feature Example
- **Minimal**: Single counter component showing core patterns.
- **Full**: Same counter feature plus full framework scaffolding; ready for extending with additional features.

## 13. Module Loading & Entrypoint
- **Minimal**: Inline `<script type="module"> import initCounter …` in `public/index.html`.
- **Full**: Separate `public/index.html` with CSP, dynamic imports, error/loading UI, and instructions to run a dev server.

## 14. Missing Extensions (in Both)
- **HTTP Client** (`createHTTPClient`/interceptors).
- **Router** (`createRouter` feature).
- **Form Validation** (schema-based via `Result`/`Either`).

---

**Summary:**
- The **minimal** starter is perfect for quickly grasping core FlexNet JSX monads, composition, and a secure JSX renderer with simple state.
- The **full** starter embodies the complete FlexNet JSX architecture—types, functions, security, VDOM, state, effects, events, and error boundaries—with testing scaffolding. It's the recommended foundation for real projects.
