// ===========================================
// STATE DEBUGGING UTILITIES
// ===========================================

export const logStateChanges = (stateName) => (newState, oldState) => {
    console.group(`State Change: ${stateName}`);
    console.log('Previous:', oldState);
    console.log('Current:', newState);
    console.groupEnd();
};

export const createStateLogger = (state, name) => {
    const logger = logStateChanges(name);
    return state.subscribe(logger);
}; 