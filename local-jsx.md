# FlexNet JSX Local

[View the source repository on GitHub](https://github.com/OGH3X/local-jsx)

## Overview

This document reviews how the `local-jsx` compares to the official FlexNet JSX documentation.

### 1. Structure Differences
- **Expected Layout**: A `src/` folder with `core/`, `systems/`, and `features/` modules, plus `public/`, `tests/`, and `docs/` directories.
- **Actual Layout**: Root files (`index.html`, `readme.md`) and a single `public/main.js` bundle. No `src/` directory, modules, or tests.

### 2. Module vs. Bundle
- **Docs**: Use ES module imports (`<script type="module">`) for runtime and feature code.
- **Local**: One opaque `main.js` loaded with a plain `<script>` tag.

### 3. Core Types
- **Docs**: `Maybe`, `Either`, `Result` as pure functions with `.map`, `.chain`, `.getOrElse`/`.fold`.
- **Local**: Custom `Maybe`/`Either` implementations in `readme.md` with different methods and no `Result` type.

### 4. State & Effects
- **Docs**: `createStore` for immutable state and a formal `Effect` system.
- **Local**: Ad-hoc `createComponent` factory using closure-based state and custom effect registration.

### 5. Routing, HTTP, Validation, Security
- **Docs**: Feature APIs for routing, HTTP client, schema validation, and sanitization.
- **Local**: No router or HTTP client; form handling and sanitization are imperative with no Either-based validation.