// Maybe type for handling optional values
const Maybe = {
    Just: value => ({
        type: 'Just',
        value,
        map: fn => Maybe.Just(fn(value)),
        chain: fn => fn(value),
        getOrElse: defaultValue => value
    }),
    Nothing: () => ({
        type: 'Nothing',
        map: fn => Maybe.Nothing(),
        chain: fn => Maybe.Nothing(),
        getOrElse: defaultValue => defaultValue
    }),
    fromNullable: value => value != null ? Maybe.Just(value) : Maybe.Nothing(),
    map: fn => maybe => 
        maybe.type === 'Just' ? Maybe.Just(fn(maybe.value)) : Maybe.Nothing(),
    chain: fn => maybe =>
        maybe.type === 'Just' ? fn(maybe.value) : Maybe.Nothing(),
    getOrElse: defaultValue => maybe =>
        maybe.type === 'Just' ? maybe.value : defaultValue
};

export default Maybe; 