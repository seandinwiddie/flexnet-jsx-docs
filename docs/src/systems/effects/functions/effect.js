// === Core Effect Type ===
// Matches the documented Effect API exactly

export const Effect = {
    of: value => ({ 
        type: 'Effect', 
        run: typeof value === 'function' ? value : () => value 
    }),
    map: fn => effect =>
        Effect.of(() => fn(effect.run())),
    chain: fn => effect =>
        Effect.of(() => fn(effect.run()).run()),
    run: effect => effect.run()
}; 