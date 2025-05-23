// Simplified secure JSX runtime
const escape = str => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Simple createElement
const createElement = (type, props, ...children) => ({
    type,
    props: { ...props, children: children.flat().filter(child => child != null) }
});

// Simple but secure render function
const render = (element, container) => {
    if (!container) return;
    
    // Clear container safely
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    // Create DOM element
    const domElement = createDOMElement(element);
    container.appendChild(domElement);
};

// Helper to create DOM elements with basic security
const createDOMElement = (element) => {
    if (typeof element === 'string' || typeof element === 'number') {
        return document.createTextNode(escape(element));
    }
    
    if (!element) {
        return document.createTextNode('');
    }
    
    if (typeof element.type === 'function') {
        return createDOMElement(element.type(element.props));
    }
    
    const domElement = document.createElement(element.type);
    const { children, ...props } = element.props || {};
    
    // Set properties safely
    Object.entries(props || {}).forEach(([name, value]) => {
        if (name.startsWith('on') && typeof value === 'function') {
            const eventName = name.toLowerCase().substring(2);
            domElement.addEventListener(eventName, value);
        } else if (typeof value === 'string') {
            domElement.setAttribute(name, escape(value));
        } else if (typeof value === 'boolean' && value) {
            domElement.setAttribute(name, '');
        }
    });
    
    // Add children
    (children || []).forEach(child => {
        domElement.appendChild(createDOMElement(child));
    });
    
    return domElement;
};

export { createElement, render }; 