# Lorem Ipsum Website

A modern enterprise website built with the FlexNet JSX framework, featuring Lorem Ipsum placeholder content throughout all pages and sections.

## Overview

This website demonstrates the complete implementation of a multi-page business website using FlexNet JSX framework principles:

- **Security-first design** with XSS prevention and input validation
- **Functional programming** with pure functions and immutable state
- **Zero dependencies** - browser-native implementation
- **Comprehensive error handling** with functional error boundaries
- **Type-safe operations** using Maybe, Either, and Result types

**Note**: All text content has been replaced with Lorem Ipsum placeholder text for demonstration purposes.

## Features

### 🔒 Security Features
- **XSS Prevention**: Automatic input sanitization and escaping
- **Content Security Policy**: CSP headers implemented
- **Input Validation**: Either type-based validation system
- **Safe DOM Operations**: Result type-wrapped DOM manipulation
- **Secure Event Handling**: Protected event listeners

### 🏗️ Architecture
- **Modular Component Structure**: Separated by features (homepage, navigation, etc.)
- **Pure Functional Components**: No side effects in component logic
- **Immutable State Management**: FlexNet JSX state store
- **Error Boundaries**: Comprehensive error handling with graceful fallbacks
- **Type System**: Maybe, Either, Result types for safe operations

### 📱 Pages
- **Homepage**: Complete landing page with hero, services, benefits sections (Lorem Ipsum content)
- **Services/Offer**: Detailed service offerings (Lorem Ipsum content)
- **About Us**: Company information and team (Lorem Ipsum content)
- **Contact**: Contact forms and information (Lorem Ipsum content)
- **FAQs**: Frequently asked questions (Lorem Ipsum content)
- **Mission Statement**: Company mission and values (Lorem Ipsum content)

## Getting Started

### Prerequisites
- Modern web browser with ES6 module support
- HTTP server (Python recommended)

### Running the Website

1. **Start the development server** from the project directory:
   ```bash
   # Using the provided development server
   python3 dev-server.py
   
   # Alternative: Python HTTP server
   python -m http.server 8000
   ```

2. **Open your browser** to:
   - **http://localhost:8000/public/**

### Project Structure

```
starter-project-website/
├── src/
│   ├── core/                    # FlexNet JSX framework core
│   │   ├── runtime/            # JSX runtime implementation
│   │   ├── types/              # Type system (Maybe, Either, Result)
│   │   ├── functions/          # Core functional utilities
│   │   └── security/           # Security functions and validation
│   │
│   ├── systems/                # Framework systems
│   │   ├── state/             # State management
│   │   ├── errors/            # Error handling and boundaries
│   │   ├── effects/           # Side effect management
│   │   ├── events/            # Event handling
│   │   └── render/            # Rendering system
│   │
│   ├── utils/                  # Utility functions
│   │   └── array.js           # Safe array operations
│   │
│   └── features/               # Website features
│       ├── navigation/         # Navigation component and logic
│       ├── homepage/           # Homepage sections and content
│       ├── services/           # Services page (Lorem Ipsum content)
│       ├── about/              # About page (Lorem Ipsum content)
│       ├── contact/            # Contact page (Lorem Ipsum content)
│       ├── faqs/               # FAQs page (Lorem Ipsum content)
│       └── mission/            # Mission page (Lorem Ipsum content)
│
├── public/                     # Static assets
│   └── index.html             # Main entry point
│
└── tests/                     # Test suite
    └── ...
```

## Content Implementation

### Homepage Sections

1. **Hero Section**
   - Lorem Ipsum headlines and descriptions
   - Call-to-action buttons with secure navigation

2. **Digital Transformation Section**
   - Lorem Ipsum business messaging
   - Placeholder content structure

3. **Lorem Ipsum Explanation**
   - Lorem Ipsum benefits list
   - Placeholder value propositions

4. **Core Services**
   - 7 service offerings with Lorem Ipsum content
   - Service cards with hover effects

5. **Lorem Ipsum Benefits**
   - 6 benefit items with Lorem Ipsum descriptions
   - Structured placeholder content

6. **Call-to-Action**
   - Lorem Ipsum buttons and descriptions
   - Secure navigation handling

### Security Implementation

All content is processed through the FlexNet JSX security layer:

```javascript
// Automatic escaping of user content
import { escape } from './src/core/security/functions.js';
const safeContent = escape(userInput);

// Input validation with Either type
const validation = validateInput(userInput);
validation.fold(
  error => console.error('Invalid input:', error),
  validInput => processInput(validInput)
);
```

### Error Handling

Comprehensive error boundaries protect against failures:

```javascript
// Functional error boundaries
const ErrorFallback = (error) => jsx('div', null, `Error: ${error.message}`);
const SafeComponent = createErrorBoundary(ErrorFallback);
```

## Development

### Adding New Pages

1. Create feature directory: `src/features/new-page/`
2. Add functions file: `functions.js` with pure functions
3. Add component file: `index.js` with JSX components
4. Update navigation in `src/features/navigation/functions.js`

### Content Structure

All content functions return Lorem Ipsum text in the following pattern:

```javascript
// Example content function
export const getContentFunction = () => {
    return Maybe.Just({
        title: "Lorem Ipsum Dolor",
        subtitle: "Lorem ipsum dolor sit amet consectetur",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        items: [
            "Lorem ipsum dolor sit amet",
            "Consectetur adipiscing elit",
            "Sed do eiusmod tempor"
        ]
    });
};
```

### Security Best Practices

1. **Always escape user content** using the `escape()` function
2. **Validate inputs** with Either type before processing
3. **Wrap components** in error boundaries
4. **Use Result type** for operations that might fail
5. **Handle both success and error cases** explicitly

## Technologies Used

- **FlexNet JSX Framework**: Modern functional reactive framework
- **ES6 Modules**: Native browser module system
- **CSS3**: Modern styling with gradients and animations
- **HTML5**: Semantic markup with CSP headers

## License

This project demonstrates the FlexNet JSX framework implementation for enterprise websites with Lorem Ipsum placeholder content.

## Resources

- [FlexNet JSX Documentation](../README.md)
- [Architecture Overview](../ARCHITECTUREOVERVIEW.md)
- [Security Practices](../security-practices.md)
- [API Reference](../api-reference.md) 