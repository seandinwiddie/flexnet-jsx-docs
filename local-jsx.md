# FlexNet JSX Local

[View the source repository on GitHub](https://github.com/OGH3X/local-jsx)

## Overview

This document reviews how the `local-jsx` example compares to the official FlexNet JSX documentation.

### 1. Directory Structure
- **Principle**: The framework's architecture, detailed in `ARCHITECTUREOVERVIEW.md`, mandates a clear separation of concerns with a `src/` directory containing `core/`, `systems/`, and `features/`.
- **Divergence**: The `local-jsx` project uses a flat layout with a single `public/main.js` bundle, which does not align with the prescribed modular structure.

### 2. Module Loading
- **Principle**: Per `getting-started-guide.md`, FlexNet JSX relies on native ES modules (`<script type="module">`) to load the runtime and feature code, ensuring dependencies are explicit.
- **Divergence**: `local-jsx` bypasses this by loading an opaque `main.js` bundle via a traditional `<script>` tag, which is contrary to the framework's modular approach.

### 3. Core Types
- **Principle**: The `api-reference.md` defines a specific set of functional types (`Maybe`, `Either`, `Result`) with consistent methods like `.map` and `.chain`.
- **Divergence**: The `local-jsx` example implements its own custom versions of `Maybe` and `Either` with different method names and omits the `Result` type entirely, creating an API inconsistency.

### 4. State and Effects
- **Principle**: The official architecture specifies using the `createStore` function for immutable state and the `Effect` system for isolating side effects.
- **Divergence**: `local-jsx` introduces a non-standard `createComponent` factory that manages state with closures and registers effects in an ad-hoc manner, failing to demonstrate the formal state and effect management systems.

### 5. System APIs
- **Principle**: The framework provides dedicated systems for routing, HTTP, validation, and security, as seen in `http-system.md` and `security-practices.md`.
- **Divergence**: The `local-jsx` example does not use these systems. Instead, it implements imperative DOM handling for its contact form without the prescribed sanitization or functional validation patterns.