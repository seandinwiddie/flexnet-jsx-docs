// === Create Element Function ===
// Matches the documented render system API

export const createElement = (type, props, ...children) => ({
    type,
    props: { ...props, children: children.flat() }
}); 