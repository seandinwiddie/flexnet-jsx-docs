// === Sample Feature Tests ===
// Template for testing FlexNet features

import { 
    setupSampleFeature, 
    transformSampleData, 
    validateSampleInput 
} from '../../../src/features/sample/functions.js';

// Mock DOM environment for testing
const createMockElement = (id) => {
    const element = {
        id,
        innerHTML: '',
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            toggle: jest.fn(),
            contains: jest.fn()
        }
    };
    return element;
};

// Mock document.querySelector
global.document = {
    querySelector: jest.fn()
};

describe('Sample Feature', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('setupSampleFeature', () => {
        test('should initialize sample feature when container exists', () => {
            const mockContainer = createMockElement('sample-container');
            document.querySelector.mockReturnValue(mockContainer);

            const result = setupSampleFeature();

            expect(document.querySelector).toHaveBeenCalledWith('#sample-container');
            expect(mockContainer.innerHTML).toBe('<p>Sample feature initialized!</p>');
            expect(result).toBe(mockContainer);
        });

        test('should return null when container does not exist', () => {
            document.querySelector.mockReturnValue(null);

            const result = setupSampleFeature();

            expect(result).toBeNull();
        });
    });

    describe('transformSampleData', () => {
        test('should transform valid data successfully', () => {
            const inputData = { name: 'test', value: 42 };
            const result = transformSampleData(inputData);

            expect(result.type).toBe('Ok');
            expect(result.value).toMatchObject({
                name: 'test',
                value: 42,
                processed: true
            });
            expect(result.value.timestamp).toBeDefined();
        });

        test('should return error for invalid data', () => {
            const result = transformSampleData(null);

            expect(result.type).toBe('Error');
            expect(result.error.message).toBe('Invalid data provided');
        });
    });

    describe('validateSampleInput', () => {
        test('should validate correct input', () => {
            const result = validateSampleInput('valid input');

            expect(result.type).toBe('Ok');
            expect(result.value).toBe('valid input');
        });

        test('should return error for empty string', () => {
            const result = validateSampleInput('');

            expect(result.type).toBe('Error');
            expect(result.error.message).toBe('Input must be a non-empty string');
        });

        test('should return error for too long input', () => {
            const longInput = 'a'.repeat(101);
            const result = validateSampleInput(longInput);

            expect(result.type).toBe('Error');
            expect(result.error.message).toBe('Input too long (max 100 characters)');
        });

        test('should trim whitespace from valid input', () => {
            const result = validateSampleInput('  valid input  ');

            expect(result.type).toBe('Ok');
            expect(result.value).toBe('valid input');
        });
    });
});
