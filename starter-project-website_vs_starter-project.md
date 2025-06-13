# starter-project-website vs. starter-project

## 1. Purpose & Scope
- **starter-project-website**: A multi-page Lorem Ipsum business website showcasing FlexNet JSX in a realistic enterprise scenario (navigation, routing, UI sections, cache-busting, CSS integration).
- **starter-project**: A single-page counter example scaffold demonstrating the complete FlexNet JSX architecture (types, core functions, secure runtime, systems, error handling) as a foundation for real applications.

## 2. Project Structure
| Aspect              | starter-project-website                                       | starter-project                                                         |
|---------------------|---------------------------------------------------------------|---------------------------------------------------------------------------|
| Directory Layout    | `src/core/`, `src/systems/`, `src/utils/`, `src/features/`, `public/`, `dev-server.py` | `src/core/`, `src/systems/`, `src/utils/`, `src/features/`, `tests/`, `public/` |
| Entry Point         | `public/index.html` with dynamic imports and cache-busting    | `public/index.html` with CSP and dynamic import of `counter`            |
| Dev Server          | `dev-server.py` HTTP server with no-cache headers & CORS      | Python HTTP server recommendation in README                             |

## 3. Core Types & Functions
- **Types**: Both implement `Maybe`, `Either`, and `Result` in `src/core/types`, matching `api-reference.md`.
- **Composition & Transforms**: Both export `compose`, `pipe`, `curry` in `composition.js` and `map`, `filter`, `reduce` in `transforms.js` (full starter) or only `compose`/`pipe` (minimal functions) in both templates.

## 4. Secure JSX Runtime
- **Shared**: `createElement`/`jsx` + `render` wrap DOM creation with XSS prevention (`escape`, `sanitizeProps`, `validateElementType`) and either/Result error handling.
- **Differences**: Website's `jsx.js` is larger (supports functional components, error boundaries) vs. starter's streamlined runtime.

## 5. Security Utilities
- Both include `src/core/security/functions.js` with `escape`, `validateInput`, `urlValidator`, `safeDOMOperation` per `security-practices.md`.

## 6. Rendering & Systems
- **Website**: Uses `src/systems/render/functions.js` with VDOM + reconciliation + patch, same as starter-project.
- **Starter**: Also includes full systems: `state`, `effects`, `events`, `errors`, mirroring the architecture overview.

## 7. Navigation & Routing
- **Website**: Custom path-based routing in `src/features/navigation/functions.js` (pushState, popstate, getPageFromPath).
- **Starter**: No router feature; dynamic import used for single feature only.

## 8. State, Effects & Events
- Both leverage `createStore` (immutable, subscriber-based) for state.
- Both include `Effect` and `createEffect` in `src/systems/effects`, and `createEventBus` in `src/systems/events` for isolating side effects and pub/sub messaging.

## 9. Error Handling
- Both implement `createErrorBoundary` and global handlers in `src/systems/errors/boundary.js`, with secure logging of sensitive data.

## 10. Feature Implementation
- **Website**: Multiple feature modules (homepage sections, services, about, contact, faqs, mission) assembled in a `WebsiteApp` with pageStore and navigation events.
- **Starter**: Only a `counter` feature demonstrating core patterns; no extra pages.

## 11. Utilities
- Both provide array helpers `head`, `tail`, `find`, `safeGet` in `src/utils/array.js`.

## 12. Tests & Quality
- **Website**: No test suite present despite README mentioning `tests/` in project structure.
- **Starter**: Includes `tests/` with unit and integration tests adjacent to source.

## 13. Missing Extensions (in Both)
1. **HTTP System**: No use of `createHTTPClient` or interceptors from `http-system.md`.
2. **Form Validation**: Contact page uses placeholder content without schema validation via `Result`/`Either`.
3. **Formal Router**: Website implements custom routing rather than the documented `createRouter` feature API.

---

**Summary:**
- **starter-project-website** demonstrates FlexNet JSX at scale—multi-page navigation, rich UI sections, development tooling, and CSS integration.
- **starter-project** focuses on the core framework scaffold—types, runtime, systems, security, rendering, and error boundaries—with test scaffolding. It's the recommended base for new applications; the website builds on it to show real-world usage.
