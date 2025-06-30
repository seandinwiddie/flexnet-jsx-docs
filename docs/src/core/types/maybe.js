// === Maybe Type Implementation ===
// Core functional type for handling nullable values

const Maybe = {
    Just: value => ({ type: 'Just', value }),
    Nothing: () => ({ type: 'Nothing' }),
    fromNullable: value => (value !== null && value !== undefined) ? Maybe.Just(value) : Maybe.Nothing(),
    map: fn => maybe =>
        maybe.type === 'Just' ? Maybe.Just(fn(maybe.value)) : Maybe.Nothing(),
    chain: fn => maybe =>
        maybe.type === 'Just' ? fn(maybe.value) : Maybe.Nothing(),
    getOrElse: defaultValue => maybe =>
        maybe.type === 'Just' ? maybe.value : defaultValue,
};

export default Maybe;
