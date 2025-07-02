// === Store Instance Functions ===
// Simple store instance management

let store = null;

export const getState = () => store ? store.getState() : {};
export const dispatch = (action) => store ? store.dispatch(action) : null;
export const subscribe = (fn) => store ? store.subscribe(fn) : () => {}; 