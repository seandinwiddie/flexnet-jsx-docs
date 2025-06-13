# local-jsx vs. starter-project-minimal

## 1. Purpose & Scope

- **local-jsx**: A self-contained demo landing page showcasing an ad-hoc functional component system for a marketing site. No server or module system required.
- **starter-project-minimal**: A hands-on teaching template that exposes the core FlexNet JSX runtime, types, and functions via ES modules and a simple counter feature.

## 2. Project Structure

| Aspect               | local-jsx                                       | starter-project-minimal                                     |
|----------------------|-------------------------------------------------|-------------------------------------------------------------|
| Directory Layout     | `index.html`, `readme.md`, `public/`            | `src/` (core/, features/), `public/`, `README.md`           |
| Modules              | None – all code bundled in `public/main.js`      | ES modules under `src/`: `core/types`, `core/functions`, `core/runtime`, `features/` |
| Tests                | None                                            | None (by design for minimal starter)                        |

## 3. Core Types

- **local-jsx**: Includes custom `Maybe`/`Either` and a `Task` implementation in its `readme.md`, with different method names and no `Result` type.
- **minimal**: Implements only the `Maybe` monad in `src/core/types/maybe.js`, matching `api-reference.md` signatures (`Just`, `Nothing`, `fromNullable`, `.map`, `.getOrElse`).

## 4. Composition Utilities

- **local-jsx**: Defines `compose`, `pipe`, and `curry` inline in its readme.
- **minimal**: Exports `compose` and `pipe` from `src/core/functions/composition.js`, exactly as documented.

## 5. Runtime & Rendering

- **local-jsx**: Uses a single `main.js` bundle for all UI logic; internal API is opaque and not split into `createElement`/`render` modules.
- **minimal**: Provides a clear `jsx.js` runtime that exposes `createElement` and `render` functions with built-in XSS prevention, per `security-practices.md`.

## 6. State Management

- **local-jsx**: Implements a `createComponent` factory in its readme for closure-based state and manual effect registration.
- **minimal**: Defines a small, subscription-based `createStore` inside the counter feature, showing immutable updates and change notifications.

## 7. Feature Implementation

- **local-jsx**: A multi-section marketing site (Navbar, Hero, Services, Portfolio carousel, Contact form, Search).
- **minimal**: A single counter component demonstrating core patterns (state updates, rendering, and type safety).

## 8. Module Loading

- **local-jsx**: `<script src="public/main.js"></script>` in `index.html`, followed by a DOMContentLoaded init call.
- **minimal**: `<script type="module"> import initCounter …</script>` as recommended in `getting-started-guide.md`.

## 9. Security & Validation

- **local-jsx**: No formal sanitization or Either-based validation for user inputs shown.
- **minimal**: `jsx.js` escapes all text and attribute values to prevent XSS, fulfilling `security-practices.md`.

## 10. HTTP, Routing, Effects

- Both examples omit the HTTP client, router, and formal effect system. The minimal starter omits these by design; `local-jsx` simply does not include them.

## 11. Alignment with Official Docs

- **local-jsx** diverges significantly from the canonical API, directory layout, and modular approach described in the root-level documentation.
- **starter-project-minimal** closely follows the root docs, illustrating the recommended ES module structure, core type implementations, composition utilities, secure runtime, and basic state management.

---

For teaching or onboarding new developers, **starter-project-minimal** is the closer match to the official FlexNet JSX principles. If converting **local-jsx** into a canonical example is desired, apply the same modular refactoring and API usage demonstrated in the minimal starter.
