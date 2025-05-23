// Counter component tests
import { increment, decrement, updateCount } from '../../../src/features/counter/functions.js';
import Maybe from '../../../src/core/types/maybe.js';

// Simple test runner for browser environment
const test = (name, testFn) => {
    try {
        testFn();
        console.log(`✅ ${name}`);
    } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
    }
};

const assertEqual = (actual, expected, message) => {
    if (actual !== expected) {
        throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
};

// Test pure functions
test('increment should add 1 to number', () => {
    assertEqual(increment(5), 6, 'increment(5)');
    assertEqual(increment(0), 1, 'increment(0)');
    assertEqual(increment(-1), 0, 'increment(-1)');
});

test('decrement should subtract 1 from number', () => {
    assertEqual(decrement(5), 4, 'decrement(5)');
    assertEqual(decrement(1), 0, 'decrement(1)');
    assertEqual(decrement(0), -1, 'decrement(0)');
});

test('updateCount should handle Maybe types correctly', () => {
    const result1 = updateCount(5, increment);
    assertEqual(result1, 6, 'updateCount with valid number');
    
    const result2 = updateCount(null, increment);
    assertEqual(result2, 0, 'updateCount with null');
    
    const result3 = updateCount(undefined, increment);
    assertEqual(result3, 0, 'updateCount with undefined');
});

test('updateCount should work with decrement', () => {
    const result = updateCount(10, decrement);
    assertEqual(result, 9, 'updateCount with decrement');
});

// Run all tests
console.log('Running counter tests...');
export { test, assertEqual }; 