// Keyboard event utilities
export const createKeyboardHandler = (keyMap) =>
    (event) => {
        const key = event.key || event.code;
        const modifiers = {
            ctrl: event.ctrlKey,
            alt: event.altKey,
            shift: event.shiftKey,
            meta: event.metaKey
        };
        
        const keyConfig = keyMap[key];
        if (!keyConfig) return null;
        
        // Check if modifiers match
        const modifierMatch = Object.entries(modifiers).every(([mod, pressed]) => {
            const required = keyConfig.modifiers && keyConfig.modifiers[mod];
            return required === undefined || required === pressed;
        });
        
        if (modifierMatch && typeof keyConfig.handler === 'function') {
            return keyConfig.handler(event);
        }
        
        return null;
    }; 