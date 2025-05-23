# CryptoVersus.io Website

A modern enterprise website built with the FlexNet JSX framework, showcasing CryptoVersus.io's enterprise decentralized infrastructure services.

## Overview

This website demonstrates the complete implementation of a multi-page business website using FlexNet JSX framework principles:

- **Security-first design** with XSS prevention and input validation
- **Functional programming** with pure functions and immutable state
- **Zero dependencies** - browser-native implementation
- **Comprehensive error handling** with functional error boundaries
- **Type-safe operations** using Maybe, Either, and Result types

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
- **Homepage**: Complete landing page with hero, services, benefits sections
- **Services/Offer**: Detailed service offerings (placeholder)
- **About Us**: Company information and team (placeholder)
- **Contact**: Contact forms and information (placeholder)
- **FAQs**: Frequently asked questions (placeholder)
- **Mission Statement**: Company mission and values (placeholder)

## Getting Started

### Prerequisites
- Modern web browser with ES6 module support
- HTTP server (Python recommended)

### Running the Website

1. **Start the development server** from the project directory:
   ```bash
   # Recommended: Python HTTP server
   python -m http.server 3000
   ```

2. **Open your browser** to:
   - **http://localhost:3000/public/**

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
│       ├── services/           # Services page (placeholder)
│       ├── about/              # About page (placeholder)
│       ├── contact/            # Contact page (placeholder)
│       ├── faqs/               # FAQs page (placeholder)
│       └── mission/            # Mission page (placeholder)
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
   - Company branding and value proposition
   - Call-to-action buttons with secure navigation

2. **Digital Transformation Section**
   - Positioning as "AWS for decentralized web"
   - Enterprise focus messaging

3. **Web3 Explanation**
   - Benefits of Web3 for enterprises
   - Clear value propositions

4. **Core Services**
   - 7 key service offerings with icons
   - Service cards with hover effects

5. **Why CryptoVersus**
   - 6 key differentiators
   - Detailed benefit explanations

6. **Call-to-Action**
   - Multiple action buttons
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

This project demonstrates the FlexNet JSX framework implementation for enterprise websites.

## Resources

- [FlexNet JSX Documentation](../README.md)
- [Architecture Overview](../ARCHITECTUREOVERVIEW.md)
- [Security Practices](../security-practices.md)
- [API Reference](../api-reference.md) 