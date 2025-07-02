// === Patch Function ===
// Applies changes to the actual DOM

export const patch = (container) => (reconcileResult) => {
    const { changes } = reconcileResult;
    
    changes.forEach(change => {
        switch (change.type) {
            case 'replace':
                const newElement = renderVirtualDOMToDOM(change.newVirtualDOM);
                if (change.node) {
                    container.replaceChild(newElement, change.node);
                } else {
                    container.appendChild(newElement);
                }
                break;
            // Add more change types as needed
        }
    });
    
    return container;
};

const renderVirtualDOMToDOM = (vdom) => {
    if (!vdom) return document.createTextNode('');
    
    if (vdom.type === 'text') {
        return document.createTextNode(vdom.value);
    }
    
    const element = document.createElement(vdom.type);
    
    // Set props
    Object.entries(vdom.props || {}).forEach(([key, value]) => {
        if (key !== 'children') {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    (vdom.children || []).forEach(child => {
        element.appendChild(renderVirtualDOMToDOM(child));
    });
    
    return element;
}; 