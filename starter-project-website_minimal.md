# FlexNet JSX Minimal Website Starter

## Overview

This document describes a `starter-project-website-minimal`, a template designed for building simple, multi-page static websites. It adapts the principles of the full `starter-project-website` to a flat, single-bundle architecture, similar to `local-jsx`, but with a stronger focus on adhering to the core FlexNet JSX APIs.

### 1. Project Structure
- **Principle**: `ARCHITECTUREOVERVIEW.md` mandates a modular `src/` directory.
- **Divergence**: To maximize simplicity, this project uses a flat public-facing layout. All logic is bundled into `main.js`, and all styles into `main.css`. This is a deliberate trade-off, sacrificing modularity for a minimal footprint.

```text
starter-project-website-minimal/
├── public/
│   ├── index.html
│   ├── main.js
│   └── main.css
└── README.md
```

### 2. Module Loading
- **Principle**: The official starters use native ES modules (`<script type="module">`) for a clear dependency graph.
- **Divergence**: `index.html` loads a single, pre-bundled `main.js` with a traditional `<script>` tag. This approach requires a build step but simplifies deployment to any static host.

### 3. Core Types & Functions
- **Principle**: `api-reference.md` defines standard `Maybe`, `Either`, and `Result` types.
- **Implementation**: The bundled `main.js` contains implementations of `Maybe` and `Either` that match the official API reference. It also includes core functions like `compose` and `pipe`. This ensures type safety and functional composition, even in a bundled setup. The `Result` type is omitted for minimalism.

### 4. Secure Rendering
- **Principle**: The runtime must prevent XSS by default, as detailed in `security-practices.md`.
- **Implementation**: The project includes a lightweight, secure renderer within `main.js`. It exposes `createElement` and `render` functions that automatically escape text content and attributes, providing foundational security without a virtual DOM.

### 5. State Management
- **Principle**: State should be immutable and managed via pure functions.
- **Implementation**: State is managed locally within components using closures or a simple, centralized store for global concerns like the active route. It demonstrates the core principle of immutable updates without the full `createStore` system.

### 6. Routing
- **Principle**: The framework provides a `createRouter` for navigation.
- **Divergence**: This starter implements a simple hash-based router inside `main.js`. It listens for `hashchange` events and renders the appropriate page component (e.g., "Home" or "About"). This approach is effective for simple SPAs and avoids the complexity of the full routing system.

### 7. Feature Implementation
- **Principle**: A website is a collection of features.
- **Implementation**: The project is structured as a simple multi-page site (e.g., Home, About, Contact) where each "page" is a function that returns a tree of elements. Navigation between them is handled by the minimal router. All component logic is contained within `main.js`.

### 8. Styling
- **Principle**: The framework is style-agnostic.
- **Implementation**: All styles are consolidated into a single `main.css` file, linked from `index.html`. This is straightforward and suitable for smaller projects.

## Conclusion

The `starter-project-website-minimal` demonstrates how to apply core FlexNet JSX principles—type safety, security, functional composition—in a simplified, single-bundle package.

While it intentionally deviates from the official directory structure and module loading strategy, it provides a valuable, pragmatic starting point for developers building small-scale static websites who still want the safety and predictability of the FlexNet JSX ecosystem. 