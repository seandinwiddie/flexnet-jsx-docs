// ===========================================
// PROPERTY HANDLING
// ===========================================

// Set property on DOM element
export const setProp = (element, key, value) => {
    if (key === 'key' || key === 'ref') {
        return; // Skip special props
    }

    if (key.startsWith('on') && typeof value === 'function') {
        // Event listener
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
    } else if (key === 'className') {
        element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
    } else if (key in element) {
        element[key] = value;
    } else {
        element.setAttribute(key, value);
    }
};

// Remove property from DOM element
export const removeProp = (element, key) => {
    if (key === 'key' || key === 'ref') {
        return; // Skip special props
    }

    if (key.startsWith('on')) {
        // Remove event listener - would need to track original function
        // This is a limitation of the functional approach
        return;
    } else if (key === 'className') {
        element.className = '';
    } else if (key === 'style') {
        element.style.cssText = '';
    } else if (key in element) {
        element[key] = '';
    } else {
        element.removeAttribute(key);
    }
}; 