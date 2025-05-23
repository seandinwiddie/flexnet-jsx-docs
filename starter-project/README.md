# FlexNet JSX Starter Project

A minimal starter template for building applications with the FlexNet JSX framework with built-in security and error handling.

## Overview

This starter project demonstrates the core principles of the FlexNet JSX framework:
- Functional programming
- Immutable state management
- Zero dependencies
- Browser-native implementation
- **Security-first design**
- **Comprehensive error handling**

## Getting Started

Start the development server from the project root directory:

```bash
# Recommended: Python HTTP server (most reliable)
python -m http.server 3000
```

Then open your browser to:
- **http://localhost:3000** (if using Python server)

**Note:** Make sure to start the server from the `starter-project/` directory (not from the parent directory) for proper module resolution.

### Troubleshooting

If you encounter module loading issues:
1. Verify you're in the correct directory (`starter-project/`)
2. Check that all files are present in the `src/` directory
3. Use Python's HTTP server for best compatibility: `python -m http.server 3000`
4. Open browser console (F12) to check for any error messages

The application should display a working counter with increment/decrement buttons.

## Project Structure

```
starter-project/
├── src/
│   ├── core/                 # Core JSX functionality
│   │   ├── runtime/          # JSX runtime
│   │   │   ├── jsx.js        # Secure JSX implementation
│   │   │   └── runtime.js    # Runtime bundle
│   │   ├── types/            # Type system
│   │   │   ├── maybe.js      # Maybe type
│   │   │   ├── either.js     # Either type
│   │   │   └── result.js     # Result type
│   │   ├── functions/        # Core functions
│   │   │   ├── composition.js # Functional composition (compose, pipe, curry)
│   │   │   └── transforms.js  # Functional array transformations (map, filter, reduce)
│   │   └── security/         # Security utilities
│   │       └── functions.js  # Input validation & sanitization
│   │
│   ├── systems/              # Framework systems
│   │   ├── state/            # State management
│   │   │   └── store.js      # State store implementation
│   │   ├── errors/           # Error handling
│   │   │   └── boundary.js   # Error boundaries & logging
│   │   ├── effects/          # Side effects
│   │   ├── events/           # Event handling
│   │   └── render/           # Rendering system
│   │
│   ├── utils/                # Utility functions
│   │   └── array.js          # Safe array operations with Maybe type
│   │
│   └── features/             # Application features
│       └── counter/          # Counter example
│           ├── functions.js  # Pure functions
│           └── index.js      # Component implementation
│
└── public/                   # Static assets
    └── index.html            # Entry point with CSP headers
```

## Features

### Type System
- Maybe: For handling optional values
- Either: For error handling and validation
- Result: For operation outcomes and safe operations

### Core Functions
- compose: Functional composition (right to left)
- pipe: Functional composition (left to right)
- curry: Partial function application

### Array Transformations
- map: Transform array elements with a function
- filter: Filter array elements with a predicate
- reduce: Reduce array to a single value

### Utility Functions
- head: Safely get the first element of an array (returns Maybe)
- tail: Safely get all elements except the first (returns Maybe)
- find: Find element matching predicate (returns Maybe)
- isEmpty: Check if array is empty
- safeGet: Safely access array element by index (returns Maybe)

### State Management
- Immutable state updates
- Subscription-based updates
- Functional state transitions
- **Error-safe state operations**

### Security Features 🔒
- **XSS Prevention**: Automatic input sanitization and escaping
- **Content Security Policy**: CSP headers in HTML
- **Input Validation**: Either type-based validation
- **Safe DOM Operations**: Result type-wrapped DOM manipulation
- **URL Validation**: Protocol whitelisting
- **Attribute Sanitization**: Safe handling of element attributes

### Error Handling 🛡️
- **Error Boundaries**: Functional error boundary system
- **Global Error Handling**: Unhandled error and promise rejection catching
- **Secure Error Logging**: Sensitive data redaction in logs
- **Result Type Integration**: Safe operation wrapping
- **Graceful Degradation**: Fallback UI for error states

## Example: Secure Counter

The included counter example demonstrates:
- Functional component structure
- Immutable state management with Maybe monad
- Type-safe operations with Result and Either types
- **Comprehensive error boundaries**
- **Secure event handling**
- **Input validation and sanitization**

## Security Implementation

### Input Sanitization
```javascript
import { escape, validateInput } from './src/core/security/functions.js';

// Automatic HTML escaping
const safeText = escape('<script>alert("xss")</script>');
// Result: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

// Input validation with Either type
const validation = validateInput(userInput);
validation.fold(
  error => console.error('Invalid input:', error),
  validInput => processInput(validInput)
);
```

### Error Boundaries
```javascript
import { createErrorBoundary } from './src/systems/errors/boundary.js';

const ErrorFallback = (error) => jsx('div', null, `Error: ${error.message}`);
const SafeComponent = createErrorBoundary(ErrorFallback);
```

### Safe DOM Operations
```javascript
import { safeDOMOperation } from './src/core/security/functions.js';

const result = safeDOMOperation(() => {
  return document.getElementById('myElement');
});

result.fold(
  error => console.error('DOM operation failed:', error),
  element => console.log('Element found:', element)
);
```

## Error Handling Patterns

### Result Type for Operations
```javascript
import Result from './src/core/types/result.js';

const safeOperation = () => {
  return Result.fromTry(() => {
    // Potentially failing operation
    return riskyFunction();
  });
};

safeOperation()
  .map(result => console.log('Success:', result))
  .chain(result => result.type === 'Error' 
    ? Either.Left(result.error) 
    : Either.Right(result));
```

### Either Type for Validation
```javascript
import Either from './src/core/types/either.js';

const validateAge = (age) => {
  return age >= 0 && age <= 150
    ? Either.Right(age)
    : Either.Left('Invalid age');
};

validateAge(25).fold(
  error => console.error(error),
  validAge => console.log('Valid age:', validAge)
);
```

## Best Practices

1. **Always use Result type for operations that might fail**
2. **Validate inputs with Either type before processing**
3. **Wrap components in error boundaries**
4. **Use escape function for user-generated content**
5. **Handle both success and error cases explicitly**
6. **Use Maybe-based utilities for safe array operations**
7. **Prefer functional transformations (map, filter, reduce) over loops**
8. **Compose complex operations using pipe for readability**

## Next Steps

1. Explore the security implementations in `src/core/security/`
2. Study error boundary patterns in `src/systems/errors/`
3. Create additional features using the secure patterns
4. Extend validation with custom Either type predicates
5. Add more comprehensive error handling to your components

## Security Compliance

This starter project implements security measures as specified in the FlexNet JSX framework:
- ✅ XSS Prevention with automatic escaping
- ✅ Input validation with functional types
- ✅ Safe DOM manipulation
- ✅ Content Security Policy headers
- ✅ Error boundary implementation
- ✅ Secure error logging

## Resources

For more information, refer to the FlexNet JSX documentation:
- [API Reference](../api-reference.md)
- [Architecture Overview](../ARCHITECTUREOVERVIEW.md)
- [Getting Started Guide](../getting-started-guide.md)
- [Security Practices](../security-practices.md)
- [HTTP System](../http-system.md)
- [Consistency Analysis](../consistency-analysis.md)

### Array Utilities with Maybe Type
```javascript
import { head, tail, find, safeGet } from './src/utils/array.js';

// Safe array operations
const numbers = [1, 2, 3, 4, 5];

head(numbers).fold(
  () => console.log('Array is empty'),
  value => console.log('First element:', value) // 1
);

find(x => x > 3)(numbers).fold(
  () => console.log('No element found'),
  value => console.log('Found:', value) // 4
);

safeGet(10)(numbers).fold(
  () => console.log('Index out of bounds'),
  value => console.log('Element at index 10:', value)
);
```

### Functional Transformations
```javascript
import { map, filter, reduce } from './src/core/functions/transforms.js';
import { pipe } from './src/core/functions/composition.js';

// Chainable array operations
const processNumbers = pipe(
  filter(x => x > 2),
  map(x => x * 2),
  reduce((sum, x) => sum + x, 0)
);

const result = processNumbers([1, 2, 3, 4, 5]); // 14
``` 