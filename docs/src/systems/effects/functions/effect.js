// === Core Effect Type ===
// Matches the documented Effect API exactly

export const Effect = {
    of: value => ({ type: 'Effect', run: () => value }),
    map: fn => effect =>
        Effect.of(() => fn(effect.run())),
    chain: fn => effect =>
        Effect.of(() => fn(effect.run()).run()),
    run: effect => effect.run()
}; 