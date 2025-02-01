# Getting Started with FlexNet JSX

Version: 1.0.0 (Released 2025-01-31)

## Project Setup

### Directory Structure
Create a new project directory with the following structure:
```
my-project/
├── src/
│   ├── core/                  # Core JSX functionality
│   │   ├── runtime/          # JSX runtime
│   │   │   ├── jsx.js
│   │   │   └── transform.js
│   │   ├── types/           # Type system
│   │   │   ├── maybe.js
│   │   │   ├── either.js
│   │   │   └── result.js
│   │   └── functions/       # Core functions
│   │       ├── composition.js
│   │       └── transforms.js
│   │
│   ├── systems/             # Framework systems
│   │   ├── render/         # Rendering
│   │   ├── state/         # State management
│   │   ├── effects/       # Side effects
│   │   └── events/        # Event handling
│   │
│   ├── features/           # Your app features
│   │   └── counter/       # Example feature
│   │       ├── functions.js
│   │       └── index.js
│   │
│   └── utils/              # Utilities
│       ├── array.js
│       └── function.js
│
├── public/                  # Static assets
│   └── index.html
│
└── tests/                  # Test files
    └── features/
        └── counter/
            └── counter.test.js
```

### Initial Setup

1. Create your `public/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>FlexNet JSX Project</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="../src/core/runtime/jsx.js"></script>
    <script type="module" src="../src/features/counter/index.js"></script>
</body>
</html>
```

2. Create your first feature (Counter Example):

```javascript
// src/features/counter/functions.js
import { Maybe } from '../../core/types/maybe.js';
import { compose } from '../../core/functions/composition.js';

export const increment = n => n + 1;
export const decrement = n => n - 1;
export const updateCount = (count, operation) =>
  Maybe.fromNullable(count)
    .map(operation)
    .getOrElse(0);

// src/features/counter/index.js
import { jsx } from '../../core/runtime/jsx.js';
import { increment, decrement, updateCount } from './functions.js';

const Counter = () => {
  let count = 0;
  
  return jsx('div', null, [
    jsx('button', { onClick: () => count = updateCount(count, decrement) }, '-'),
    jsx('span', null, count),
    jsx('button', { onClick: () => count = updateCount(count, increment) }, '+')
  ]);
};

export default Counter;
```

### Core Concepts

1. Pure Functions
   - All operations should be pure functions
   - Use composition for complex operations
   - Avoid side effects outside effect system

2. Type Safety
   - Use Maybe for optional values
   - Use Either for error handling
   - Use Result for operation outcomes

3. State Management
   - Immutable state updates
   - Pure state transitions
   - State isolation through closures

4. Effect Handling
   - Isolate side effects
   - Use effect system for async operations
   - Clean up effects properly

### Development Workflow

1. Feature Development
   - Create feature directory in src/features/
   - Implement pure functions in functions.js
   - Create feature component in index.js
   - Add tests in parallel

2. Testing
   - Write tests in adjacent test directory
   - Use property-based testing
   - Test pure functions independently
   - Test effects in isolation

3. Documentation
   - Document function signatures
   - Specify type information
   - Include usage examples
   - Document effects

### Best Practices

1. File Organization
   - Keep related files together
   - Use clear, descriptive names
   - Follow directory structure
   - Maintain separation of concerns

2. Code Style
   - Write pure functions
   - Use functional composition
   - Maintain immutability
   - Document types clearly

3. Testing
   - Test pure functions
   - Test effect isolation
   - Use property-based tests
   - Maintain test coverage

4. Performance
   - Optimize render functions
   - Minimize state updates
   - Handle effects efficiently
   - Monitor performance

### Next Steps

1. Explore the examples in /examples
2. Read the API documentation
3. Study the architecture overview
4. Join the community

For more detailed information, refer to:
- API Reference
- Architecture Overview
- Security Practices Guide