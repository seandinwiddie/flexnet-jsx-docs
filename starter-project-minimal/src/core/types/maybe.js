// Maybe type for handling optional values
const Maybe = {
    Just: value => ({
        type: 'Just',
        value,
        map: fn => Maybe.Just(fn(value)),
        getOrElse: defaultValue => value
    }),
    Nothing: () => ({
        type: 'Nothing',
        map: fn => Maybe.Nothing(),
        getOrElse: defaultValue => defaultValue
    }),
    fromNullable: value => value != null ? Maybe.Just(value) : Maybe.Nothing()
};

export default Maybe; 