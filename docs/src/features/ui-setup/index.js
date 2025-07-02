// === FlexNet UI Setup Module ===
// Pure functional UI orchestration with immutable state management

import Either from '../../core/types/either.js';
import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';
import { pipe, compose } from '../../core/functions/composition.js';
import { createState, transition, validateState, StateUtils } from '../../systems/state/functions.js';
import { logInfo, logError, logWarn, parallel, sequence } from '../../systems/effects/functions.js';
import { setupRenderEffects } from '../../systems/render/functions.js';
import { setupBreadcrumbsEffect } from '../navigation/functions.js';

// UI State Schema - define the shape of our UI state
const createUIStateSchema = () => ({
    initialized: false,
    components: {
        logo: { status: 'pending', result: null },
        mobileSidebar: { status: 'pending', result: null },
        breadcrumbs: { status: 'pending', result: null },
        copyButtons: { status: 'pending', result: null },
        sidebarActiveLink: { status: 'pending', result: null },
        sidebarAccordion: { status: 'pending', result: null },
        syntaxHighlighting: { status: 'pending', result: null }
    },
    basePath: null,
    errors: [],
    startTime: Date.now(),
    endTime: null
});

// Pure function to validate UI state schema
const validateUIState = (state) => {
    const requiredFields = ['initialized', 'components', 'basePath', 'errors', 'startTime'];
    const hasAllFields = requiredFields.every(field => field in state);
    
    if (!hasAllFields) {
        return false;
    }
    
    const hasValidComponents = state.components && typeof state.components === 'object';
    const hasValidErrors = Array.isArray(state.errors);
    
    return hasValidComponents && hasValidErrors;
};

// Pure function to create initial UI state
export const createInitialUIState = (basePath) => {
    const initialSchema = createUIStateSchema();
    const initialStateWithPath = {
        ...initialSchema,
        basePath
    };
    
    return createState(initialStateWithPath);
};

// Pure state transition functions
export const UIStateTransitions = {
    // Mark component as started
    startComponent: (componentName) => (state) => ({
        ...state,
        components: {
            ...state.components,
            [componentName]: {
                ...state.components[componentName],
                status: 'loading'
            }
        }
    }),

    // Mark component as completed successfully
    completeComponent: (componentName, result) => (state) => ({
        ...state,
        components: {
            ...state.components,
            [componentName]: {
                status: 'completed',
                result
            }
        }
    }),

    // Mark component as failed
    failComponent: (componentName, error) => (state) => ({
        ...state,
        components: {
            ...state.components,
            [componentName]: {
                status: 'failed',
                result: error
            }
        },
        errors: [...state.errors, { component: componentName, error: error.message || String(error) }]
    }),

    // Mark entire initialization as complete
    completeInitialization: () => (state) => ({
        ...state,
        initialized: true,
        endTime: Date.now()
    }),

    // Add general error
    addError: (error) => (state) => ({
        ...state,
        errors: [...state.errors, { general: true, error: error.message || String(error) }]
    })
};

// Pure function to check if all components are complete
const areAllComponentsComplete = (state) => {
    const components = Object.values(state.components);
    return components.every(component => 
        component.status === 'completed' || component.status === 'failed'
    );
};

// Pure function to get component results
const getComponentResults = (state) => {
    const results = {};
    Object.entries(state.components).forEach(([name, component]) => {
        if (component.status === 'completed') {
            results[name] = component.result;
        } else if (component.status === 'failed') {
            results[name] = { error: component.result };
        }
    });
    return results;
};

// Pure function to execute component setup with state management
const executeComponentSetup = async (componentName, setupEffect, uiState) => {
    // Transition to loading state
    const loadingStateResult = transition(UIStateTransitions.startComponent(componentName))(uiState);
    
    if (loadingStateResult.type === 'Left') {
        logError(`Failed to transition ${componentName} to loading state:`, loadingStateResult.value);
        return Either.Left(loadingStateResult.value);
    }

    try {
        logInfo(`[UI Setup] Starting ${componentName} setup`);
        const result = await setupEffect();
        
        if (result.type === 'Left') {
            const failedStateResult = transition(UIStateTransitions.failComponent(componentName, result.value))(loadingStateResult.value);
            return failedStateResult;
        }

        const completedStateResult = transition(UIStateTransitions.completeComponent(componentName, result.value))(loadingStateResult.value);
        logInfo(`[UI Setup] Completed ${componentName} setup successfully`);
        return completedStateResult;

    } catch (error) {
        logError(`[UI Setup] Error in ${componentName} setup:`, error);
        const failedStateResult = transition(UIStateTransitions.failComponent(componentName, error))(loadingStateResult.value);
        return failedStateResult;
    }
};

// Main UI setup orchestrator with immutable state management
export const setupUI = async (basePath) => {
    logInfo("[UI Setup] Initializing all UI components with state management.");
    
    // Create initial state
    const initialStateResult = createInitialUIState(basePath);
    if (initialStateResult.type === 'Left') {
        logError("Failed to create initial UI state:", initialStateResult.value);
        return Either.Left(initialStateResult.value);
    }

    let currentState = initialStateResult.value;

    // Validate initial state
    const validationResult = validateState(validateUIState)(currentState);
    if (validationResult.type === 'Left') {
        logError("Initial UI state validation failed:", validationResult.value);
        return Either.Left(validationResult.value);
    }

    try {
        // Define component setup effects
        const componentSetups = [
            { name: 'logo', effect: () => setupRenderEffects(basePath) },
            { name: 'syntaxHighlighting', effect: () => setupRenderEffects(basePath) },
            { name: 'sidebarAccordion', effect: () => setupRenderEffects(basePath) },
            { name: 'sidebarActiveLink', effect: () => setupRenderEffects(basePath) },
            { name: 'mobileSidebar', effect: () => setupRenderEffects(basePath) },
            { name: 'copyButtons', effect: () => setupRenderEffects(basePath) },
            { name: 'breadcrumbs', effect: () => setupBreadcrumbsEffect() }
        ];

        // Execute component setups sequentially to maintain state consistency
        for (const { name, effect } of componentSetups) {
            const setupResult = await executeComponentSetup(name, effect, currentState);
            
            if (setupResult.type === 'Left') {
                logWarn(`Component ${name} setup failed, continuing with others:`, setupResult.value);
            } else {
                currentState = setupResult.value;
            }
        }

        // Mark initialization as complete
        const finalStateResult = transition(UIStateTransitions.completeInitialization())(currentState);
        
        if (finalStateResult.type === 'Left') {
            logError("Failed to mark initialization as complete:", finalStateResult.value);
            return Either.Left(finalStateResult.value);
        }

        const finalState = finalStateResult.value;
        
        // Generate results summary
        const results = getComponentResults(finalState.value);
        const totalTime = finalState.value.endTime - finalState.value.startTime;
        
        logInfo(`[UI Setup] All components setup completed in ${totalTime}ms`);
        
        if (finalState.value.errors.length > 0) {
            logWarn(`[UI Setup] Completed with ${finalState.value.errors.length} errors:`, finalState.value.errors);
        }

        return Either.Right({
            state: finalState.value,
            results,
            totalTime,
            errors: finalState.value.errors,
            success: finalState.value.initialized
        });

    } catch (error) {
        logError("[UI Setup] Critical error during component initialization:", error);
        
        const errorStateResult = transition(UIStateTransitions.addError(error))(currentState);
        
        return Either.Left({
            error,
            state: errorStateResult.type === 'Right' ? errorStateResult.value.value : currentState.value,
            message: "Critical error during UI setup"
        });
    }
};

// Pure function to get UI setup status
export const getUISetupStatus = (uiState) => {
    if (!uiState || typeof uiState !== 'object') {
        return Either.Left('Invalid UI state');
    }

    const componentStatuses = Object.entries(uiState.components).map(([name, component]) => ({
        name,
        status: component.status,
        hasError: component.status === 'failed'
    }));

    const totalComponents = componentStatuses.length;
    const completedComponents = componentStatuses.filter(c => c.status === 'completed').length;
    const failedComponents = componentStatuses.filter(c => c.status === 'failed').length;
    const pendingComponents = componentStatuses.filter(c => c.status === 'pending' || c.status === 'loading').length;

    return Either.Right({
        initialized: uiState.initialized,
        totalComponents,
        completedComponents,
        failedComponents,
        pendingComponents,
        totalErrors: uiState.errors.length,
        componentStatuses,
        timeTaken: uiState.endTime ? uiState.endTime - uiState.startTime : null
    });
};

// Export state management utilities for external use
export const UIStateUtils = {
    createInitialUIState,
    UIStateTransitions,
    validateUIState,
    areAllComponentsComplete,
    getComponentResults,
    getUISetupStatus
}; 