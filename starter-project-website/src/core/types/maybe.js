// Maybe type for handling optional values with enhanced safety
const Maybe = {
    Just: value => ({
        type: 'Just',
        value,
        map: fn => {
            try {
                return Maybe.Just(fn(value));
            } catch (error) {
                return Maybe.Nothing();
            }
        },
        chain: fn => {
            try {
                const result = fn(value);
                return result && (result.type === 'Just' || result.type === 'Nothing') ? result : Maybe.Just(result);
            } catch (error) {
                return Maybe.Nothing();
            }
        },
        getOrElse: defaultValue => value,
        fold: (nothingFn, justFn) => {
            try {
                return justFn(value);
            } catch (error) {
                return nothingFn();
            }
        }
    }),
    Nothing: () => ({
        type: 'Nothing',
        map: fn => Maybe.Nothing(),
        chain: fn => Maybe.Nothing(),
        getOrElse: defaultValue => defaultValue,
        fold: (nothingFn, justFn) => {
            try {
                return nothingFn();
            } catch (error) {
                return undefined;
            }
        }
    }),
    fromNullable: value => value != null ? Maybe.Just(value) : Maybe.Nothing(),
    // Static helper methods with null safety
    map: fn => maybe => {
        if (!maybe || typeof maybe !== 'object' || !maybe.type) {
            return Maybe.Nothing();
        }
        return maybe.type === 'Just' ? Maybe.Just(fn(maybe.value)) : Maybe.Nothing();
    },
    chain: fn => maybe => {
        if (!maybe || typeof maybe !== 'object' || !maybe.type) {
            return Maybe.Nothing();
        }
        return maybe.type === 'Just' ? fn(maybe.value) : Maybe.Nothing();
    },
    getOrElse: defaultValue => maybe => {
        if (!maybe || typeof maybe !== 'object' || !maybe.type) {
            return defaultValue;
        }
        return maybe.type === 'Just' ? maybe.value : defaultValue;
    }
};

export default Maybe; 