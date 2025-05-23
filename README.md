# FlexNet JSX Framework

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A functional JavaScript implementation designed for building modern web applications. FlexNet JSX implements the JSX Framework Persistent Memory Protocol.

Created by Dr. Robert Whetsel and the FlexNet Development Team from AcmeWerx and CryptoVersus.io.

## Core Principles

- Functions as Primary Operations
- Immutable State Management
- Functional Composition
- Zero Dependencies
- Browser Native Implementation

For detailed information on implementation compliance, see [consistency-analysis.md](consistency-analysis.md).

## Core Architecture

- Pure Functional Core Architecture
- Type System (Maybe, Either, Result)
- Effect System with Cleanup
- State Management with Immutable Updates
- Router System with Functional Guards
- Property-Based Testing Framework

For comprehensive architectural details, see [ARCHITECTUREOVERVIEW.md](ARCHITECTUREOVERVIEW.md).

## Installation

The framework uses a controlled installation process through shell scripts that:
- Verify directory structure
- Set correct permissions
- Validate installations
- Ensure proper error handling

Include the framework directly in your HTML:

```html
<script type="module" src="path/to/jsx/src/index.js"></script>
```

For complete setup instructions and project structure, see [getting-started-guide.md](getting-started-guide.md).

## Directory Structure
```
.
├── src/
│   ├── core/
│   │   ├── build/          # Build system
│   │   ├── runtime/        # Runtime implementation
│   │   ├── types/          # Type system
│   │   └── functions/      # Core functions
│   │
│   ├── systems/            # System implementations
│   │   ├── render/         # Rendering system
│   │   ├── state/         # State management
│   │   ├── effects/       # Effect handling
│   │   └── events/        # Event system
│   │
│   └── utils/             # Utility functions
│
├── __tests__/             # Test suite
│   ├── core/             # Core tests
│   ├── systems/          # System tests
│   └── features/         # Feature tests
│
├── examples/              # Example code
│   ├── basic/           # Basic examples
│   └── advanced/        # Advanced examples
│
└── docs/                 # Documentation
    ├── ARCHITECTUREOVERVIEW.md
    ├── api-reference.md
    └── getting-started-guide.md
```

## Core Features

### Type System
- Maybe Type: Optional value handling
- Either Type: Error handling and branching
- Result Type: Operation outcomes

All types follow functional programming principles with proper monadic operations.

For detailed type implementations and API documentation, see [api-reference.md](api-reference.md).

### Basic Counter Example
```javascript
import { compose, Maybe } from './src/core/runtime/runtime.js';
import { createStore } from './src/systems/state/store.js';
import { createElement } from './src/core/runtime/jsx.js';

// Create immutable store
const store = createStore(Maybe.Just(0));

// Pure function for state update
const increment = n => Maybe.Just(n + 1);

// Counter component as pure function
const Counter = ({ count, onIncrement }) =>
  createElement('div', null,
    createElement('h2', null, `Count: ${count}`),
    createElement('button', {
      onClick: compose(onIncrement, increment)
    }, 'Increment')
  );

// Render with proper effect handling
store.subscribe(count =>
  render(
    createElement(Counter, {
      count: count,
      onIncrement: store.update
    }),
    document.getElementById('root')
  )
);
```

## Starter Projects

Get started quickly with our ready-to-use starter templates:

### 🚀 Full-Featured Starter ([starter-project/](starter-project/))

A comprehensive implementation demonstrating all framework features:

**Features:**
- ✅ **Complete Type System** - Maybe, Either, Result types
- ✅ **Advanced Security** - XSS prevention, input validation, CSP headers
- ✅ **Error Boundaries** - Functional error handling with fallback UI
- ✅ **Effect System** - Side effect management with cleanup
- ✅ **Event System** - Pub/sub event handling
- ✅ **Testing Framework** - Property-based testing utilities
- ✅ **Advanced Rendering** - VDOM and reconciliation system
- ✅ **Utility Functions** - Array, string, and function helpers

**Perfect for:**
- Production applications
- Learning advanced functional patterns
- Understanding comprehensive error handling
- Exploring all framework capabilities

```bash
# Quick start
cd starter-project
python -m http.server 3000
# Open http://localhost:3000
```

### ⚡ Minimal Starter ([starter-project-minimal/](starter-project-minimal/))

A lightweight implementation focusing on core concepts:

**Features:**
- ✅ **Essential Types** - Maybe monad for optional values
- ✅ **Basic Security** - XSS prevention with input escaping
- ✅ **Functional Core** - Pure functions and composition
- ✅ **Simple State** - Subscription-based state management
- ✅ **Counter Example** - Working demonstration

**Perfect for:**
- Beginners learning functional programming
- Quick prototypes
- Understanding core concepts
- Minimal overhead projects

```bash
# Quick start
cd starter-project-minimal
python -m http.server 3000
# Open http://localhost:3000
```

### 📊 Comparison

| Feature | Minimal | Full-Featured |
|---------|---------|---------------|
| **Files** | 6 | 12+ |
| **Lines of Code** | ~100 | 500+ |
| **Type System** | Maybe only | Maybe, Either, Result |
| **Error Handling** | Basic | Comprehensive boundaries |
| **Security** | XSS prevention | Advanced validation |
| **Learning Curve** | Easy | Moderate |
| **Use Case** | Learning, prototypes | Production apps |

Both starters are fully compliant with FlexNet JSX framework specifications and demonstrate functional programming principles.

## Technical Standards

### Script Safety
- Error Trapping
- Variable Quoting
- Permission Handling
- Cleanup Procedures
- File Integrity Verification

For security best practices implementation, see [security-practices.md](security-practices.md).

### State Management
- Context Preservation
- File System Management
- Implementation Rules
- Technical Focus

For state management implementation details, see [consistency-analysis.md](consistency-analysis.md).

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Core Modules

### Core Runtime
- Type System Implementation
- Effect Management
- State Preservation
- Memory Management
- Technical Standards

### Utilities
- Error Handling System
- Input Validation
- Event Management
- State Control
- Data Standardization

### HTTP System
- Functional Request/Response Types
- Effect-Based Network Operations
- Immutable Cache Management
- Functional Interceptors

For HTTP system specifications, see [http-system.md](http-system.md).

## Documentation

Refer to the following documentation:
- Architecture Overview
- Technical Standards
- Implementation Guide
- Security Protocol

### Documentation Files

#### getting-started-guide.md
A comprehensive guide for setting up a new FlexNet JSX project. Includes detailed directory structure, initial file setup examples, core concepts explanation, development workflow recommendations, and best practices for functional programming implementation.

#### api-reference.md
Complete API documentation for the FlexNet JSX framework. Details core types (Maybe, Either, Result), core functions (composition, transforms), system APIs (render, state, effects, events), feature APIs, security functions, and utility functions with code examples.

#### consistency-analysis.md
Analysis of the framework's compliance with functional programming principles. Covers directory structure alignment, implementation standards, core patterns, and pre-release tasks. Includes a migration strategy and technical standards verification.

#### http-system.md
Specification for the functional HTTP system within the framework. Details core types (Request, Response, Cache, Interceptor), HTTP client API usage, type verification, error handling, and effect isolation patterns following functional programming principles.

#### security-practices.md
Security best practices for the framework implementation. Covers XSS prevention techniques, state management security, error handling patterns, memory state security, and technical standards implementation using functional programming approaches.

## Version Information
- Version: 1.0.0
- Architecture Version: 1.0.0
- Protocol Version: 1.0.0
- Last Updated: 2025-01-31

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built for modern web applications with a focus on functional programming principles and state management.