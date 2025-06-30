// === Sample Feature Functions ===
// Template functions for FlexNet feature development

import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';
import { pipe } from '../../core/functions/composition.js';
import { query } from '../../systems/effects/functions.js';

// Sample feature setup function
export const setupSampleFeature = () => {
    console.log('[Sample Feature] Setting up sample feature');
    
    return pipe(
        query('#sample-container'),
        Maybe.map(container => {
            container.innerHTML = '<p>Sample feature initialized!</p>';
            return container;
        }),
        Maybe.getOrElse(null)
    );
};

// Sample data transformation
export const transformSampleData = (data) => {
    if (!data || typeof data !== 'object') {
        return Result.Error(new Error('Invalid data provided'));
    }
    
    return Result.Ok({
        ...data,
        processed: true,
        timestamp: new Date().toISOString()
    });
};

// Sample validation function
export const validateSampleInput = (input) => {
    if (typeof input !== 'string' || input.length === 0) {
        return Result.Error(new Error('Input must be a non-empty string'));
    }
    
    if (input.length > 100) {
        return Result.Error(new Error('Input too long (max 100 characters)'));
    }
    
    return Result.Ok(input.trim());
};
