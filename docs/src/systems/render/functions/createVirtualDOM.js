// === Create Virtual DOM ===
// Creates a virtual DOM representation of elements

export const createVirtualDOM = (element) => {
    if (typeof element === 'string' || typeof element === 'number') {
        return { type: 'text', value: String(element) };
    }
    
    if (element && element.type) {
        return {
            type: element.type,
            props: element.props || {},
            children: (element.props?.children || []).map(createVirtualDOM)
        };
    }
    
    return null;
}; 