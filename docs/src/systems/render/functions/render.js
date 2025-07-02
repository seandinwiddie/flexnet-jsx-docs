// === Render Function ===
// Matches the documented render system API

import { pipe } from '../../../core/functions/composition.js';
import { createVirtualDOM } from './createVirtualDOM.js';
import { reconcile } from './reconcile.js';
import { patch } from './patch.js';

export const render = (element, container) =>
    pipe(
        createVirtualDOM,
        reconcile(container.firstChild),
        patch(container)
    )(element); 