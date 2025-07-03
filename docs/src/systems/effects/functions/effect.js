// === Core Effect Type ===
// A more robust, functional Effect type implementation

const Effect = (run) => ({
    run,
    map: (fn) => Effect(() => fn(run())),
    chain: (fn) => Effect(() => fn(run()).run())
});

Effect.of = (value) => Effect(() => value);

export { Effect }; 