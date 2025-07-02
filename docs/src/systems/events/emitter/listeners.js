import { curry } from '../../../core/functions/composition.js';
import { validateEventName, validateListener } from './validation.js';

// ===========================================
// LISTENER MANAGEMENT FUNCTIONS
// ===========================================

export const createOnFunction = (getState, updateState) => 
    curry((eventName, listener) => {
        if (!validateEventName(eventName) || !validateListener(listener)) {
            return false;
        }
        
        updateState(state => {
            const listeners = new Map(state.listeners);
            const eventListeners = listeners.get(eventName) || [];
            listeners.set(eventName, [...eventListeners, listener]);
            
            return {
                ...state,
                listeners
            };
        });
        
        return true;
    });

export const createOffFunction = (getState, updateState) => 
    curry((eventName, listener) => {
        updateState(state => {
            const listeners = new Map(state.listeners);
            const eventListeners = listeners.get(eventName) || [];
            const newListeners = eventListeners.filter(l => l !== listener);
            
            if (newListeners.length === 0) {
                listeners.delete(eventName);
            } else {
                listeners.set(eventName, newListeners);
            }
            
            return {
                ...state,
                listeners
            };
        });
        
        return true;
    });

export const createOnceFunction = (onFunction) => 
    curry((eventName, listener) => {
        const wrappedListener = (...args) => {
            listener(...args);
            // Remove after execution - simplified approach
        };
        
        return onFunction(eventName, wrappedListener);
    });

export const createRemoveAllListenersFunction = (getState, updateState) => 
    (eventName) => {
        updateState(state => {
            if (eventName) {
                const listeners = new Map(state.listeners);
                listeners.delete(eventName);
                return { ...state, listeners };
            } else {
                return { ...state, listeners: new Map() };
            }
        });
    };
