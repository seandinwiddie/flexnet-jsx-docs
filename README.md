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

## Core Architecture

- Pure Functional Core Architecture
- Type System (Maybe, Either, Result)
- Effect System with Cleanup
- State Management with Immutable Updates
- Router System with Functional Guards
- Property-Based Testing Framework

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

## Technical Standards

### Script Safety
- Error Trapping
- Variable Quoting
- Permission Handling
- Cleanup Procedures
- File Integrity Verification

### State Management
- Context Preservation
- File System Management
- Implementation Rules
- Technical Focus

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

## Documentation

Refer to the following documentation:
- Architecture Overview
- Technical Standards
- Implementation Guide
- Security Protocol

## Version Information
- Version: 1.0.0
- Architecture Version: 1.0.0
- Protocol Version: 1.0.0
- Last Updated: 2025-01-31

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built for modern web applications with a focus on functional programming principles and state management.