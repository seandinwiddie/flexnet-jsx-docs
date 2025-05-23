# FlexNet JSX Minimal Starter

A minimal starter template demonstrating the core FlexNet JSX framework principles.

## Overview

This minimal starter demonstrates:
- ✅ **Functional programming** - Pure functions, composition
- ✅ **Type safety** - Maybe monad for optional values
- ✅ **Security** - XSS prevention with input escaping
- ✅ **Zero dependencies** - Browser-native implementation
- ✅ **Immutable state** - Functional state management

## Quick Start

```bash
# Serve with any static server
python -m http.server
# or
npx serve
```

Open browser to http://localhost:8000 (or your server's port).

## Structure

```
starter-project-minimal/
├── src/
│   ├── core/
│   │   ├── types/
│   │   │   └── maybe.js          # Maybe monad
│   │   ├── functions/
│   │   │   └── composition.js    # compose, pipe
│   │   └── runtime/
│   │       └── jsx.js            # Secure JSX runtime
│   └── features/
│       └── counter/
│           └── index.js          # Counter example
└── public/
    └── index.html                # Entry point
```

## Core Concepts

### Maybe Type
Handles optional values safely:
```javascript
const count = Maybe.Just(5);
count.map(n => n + 1).getOrElse(0); // 6
```

### Functional Composition
```javascript
const increment = n => n + 1;
const double = n => n * 2;
const incrementAndDouble = compose(double, increment);
```

### Secure JSX
Automatically escapes content to prevent XSS:
```javascript
createElement('div', null, userInput); // Safe!
```

## What's Included

- **Maybe monad** for optional value handling
- **Functional composition** utilities
- **Secure JSX runtime** with XSS prevention  
- **Simple state management** with subscriptions
- **Counter example** demonstrating all concepts

## What's NOT Included (by design)

- Either/Result types (Maybe is sufficient for basic apps)
- Complex error boundaries
- Advanced rendering (VDOM, reconciliation)
- Effects system
- Event bus
- Testing framework
- Build tools

## Extending

To add more features:
1. Add Either/Result types for error handling
2. Create additional components in `src/features/`
3. Add utilities in `src/utils/`
4. Implement routing in `src/systems/router/`

## Framework Compliance

This minimal starter follows FlexNet JSX core principles:
- ✅ Functions as primary operations
- ✅ Immutable state management  
- ✅ Functional composition
- ✅ Zero external dependencies
- ✅ Browser-native implementation
- ✅ XSS prevention

**Lines of Code: ~100** (vs 500+ in full version)
**Files: 5** (vs 12+ in full version) 