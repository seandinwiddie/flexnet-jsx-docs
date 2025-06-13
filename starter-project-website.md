# FlexNet JSX Website Starter Review

## Overview

This document reviews how the `starter-project-website` template aligns with the official FlexNet JSX documentation, serving as a practical guide to the principles in the root-level docs.

### 1. Project Structure
- **Principle**: `ARCHITECTUREOVERVIEW.md` specifies a modular structure with distinct directories for `core`, `systems`, `features`, and `utils`.
- **Implementation**: The starter website adheres to this structure, organizing its multi-page features (homepage, about, etc.) and systems (state, render, errors) into the prescribed directories.

### 2. Core Types
- **Principle**: The `api-reference.md` requires `Maybe`, `Either`, and `Result` for type-safe operations, complete with monadic methods like `map` and `chain`.
- **Implementation**: This starter correctly implements all three types in `src/core/types`, providing both instance and static helper methods that align with the API reference.

### 3. Core Functions
- **Principle**: The framework provides core functional utilities for composition and transformation.
- **Implementation**: The starter includes `compose`, `pipe`, `curry`, `map`, `filter`, and `reduce` in `src/core/functions`, matching the documented APIs.

### 4. Secure JSX Runtime
- **Principle**: The runtime must prevent XSS attacks by default, as detailed in `security-practices.md`.
- **Implementation**: `src/core/runtime/jsx.js` fulfills this by wrapping element creation in `Either`/`Result` and automatically using `sanitizeProps`, `validateElementType`, and `escape` for all content.

### 5. Security Utilities
- **Principle**: Security is a core, built-in feature, not an afterthought.
- **Implementation**: The project includes a dedicated `src/core/security/functions.js` module for content escaping, input validation, and URL whitelisting, as the security docs prescribe.

### 6. Rendering System
- **Principle**: Rendering is a pure, functional pipeline, as described in `ARCHITECTUREOVERVIEW.md`.
- **Implementation**: The starter demonstrates this with a `renderPipeline` in `src/systems/render/functions.js` that composes `createVirtualDOM`, `reconcile`, and `patch`.

### 7. State Management
- **Principle**: State must be immutable and updated via pure functions.
- **Implementation**: The project uses an immutable, subscriber-based `createStore` from `src/systems/state/store.js`.

### 8. Effects & Events
- **Principle**: Side effects must be isolated in the `Effect` system, and a global event bus should be available for cross-component communication.
- **Implementation**: The starter provides both `Effect` monad helpers in `src/systems/effects/` and a `createEventBus` in `src/systems/events/`.

### 9. Error Handling
- **Principle**: The framework must provide robust, functional error handling.
- **Implementation**: `src/systems/errors/boundary.js` provides `createErrorBoundary` and `errorLogger` with data redaction, matching the patterns in `security-practices.md`.

### 10. Utilities
- **Principle**: Common operations should be abstracted into safe, reusable utility functions.
- **Implementation**: `src/utils/array.js` provides safe array operations (`head`, `tail`, etc.) that return a `Maybe`.

### 11. Feature Implementation & Routing
- **Principle**: The framework provides a `createRouter` function for handling navigation.
- **Implementation & Divergence**: This project demonstrates a more manual approach to routing using the browser's native `history.pushState` and `popstate` APIs. While effective, it bypasses the formal `createRouter` system, offering a look at a lower-level implementation.

### 12. Module Loading & Entrypoint
- **Principle**: The application should load via native ES modules, with security considerations like CSP.
- **Implementation**: `public/index.html` uses a `<script type="module">` loader with dynamic `import()`, cache-busting, and a Content Security Policy header.

### 13. Development Server
- **Principle**: The framework is dependency-free and can be served by any static server.
- **Implementation**: The project includes a `dev-server.py` to provide a better development experience with cache-busting and CORS headers.

## Areas for Further Teaching
The starter provides an excellent foundation but intentionally omits a few advanced systems for clarity. These represent opportunities to extend the project to teach the full framework:
1.  **HTTP System**: The functional `createHTTPClient` from `http-system.md` is not used. An API call in the contact form feature could be added to demonstrate this.
2.  **Formal Router**: As noted, the project uses a custom router. Refactoring it to use the official `createRouter` API would complete the systems demonstration.
3.  **Schema-Based Validation**: The project includes input validation, but not the advanced schema validation from the `features/validation` API. The contact form is an ideal place to implement this.
4.  **Testing**: The `README.md` mentions a `tests/` directory, but it is not included in the project. Adding property-based tests for the core functions and unit tests for the components would demonstrate the testing approach from `consistency-analysis.md`.

---
The **starter-project-website** demonstrates nearly all core FlexNet JSX principles in a realistic multi-page website. To cover every root-level concept, one could add HTTP client usage, a router feature, form-validation examples, and a test suite.
