import Maybe from '../../types/maybe.js';

// Serialization utilities for debugging
export const elementToString = (element) =>
    Maybe.fromNullable(element)
        .chain(el => el._isFlexNetElement ? Maybe.Just(el) : Maybe.Nothing())
        .map(el => {
            const type = typeof el.type === 'string' ? el.type : el.type.name || 'Component';
            const props = Object.entries(el.props)
                .filter(([key]) => key !== 'children')
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            const children = el.props.children || [];
            
            return children.length > 0
                ? `<${type}${props ? ' ' + props : ''}>${children.length} children</${type}>`
                : `<${type}${props ? ' ' + props : ''} />`;
        })
        .getOrElse('Invalid Element');
