import { jsx, render } from '../../core/runtime/jsx.js';
import { increment, decrement, updateCount } from './functions.js';
import { createStore } from '../../systems/state/store.js';
import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';
import Either from '../../core/types/either.js';
import { compose } from '../../core/functions/composition.js';
import { createErrorBoundary, setupGlobalErrorHandler } from '../../systems/errors/boundary.js';

// Create a store with initial count of 0
const store = createStore(Maybe.Just(0));

// Counter component as pure function with error handling
const Counter = ({ count, onIncrement, onDecrement }) => {
  // Validate count prop
  const safeCount = count && count.type === 'Just' ? count.value : 0;
  
  return jsx('div', { 
    style: 'display: flex; align-items: center; justify-content: center; margin: 20px;' 
  }, [
    jsx('button', { 
      onClick: () => {
        // Wrap in Result for error handling
        Result.fromTry(() => onDecrement())
          .map(() => console.log('Decrement successful'))
          .chain(result => result.type === 'Error' 
            ? Either.Left(`Decrement error: ${result.error.message}`)
            : Either.Right(result));
      },
      style: 'font-size: 16px; padding: 5px 10px; margin: 5px; cursor: pointer;'
    }, '-'),
    jsx('span', { 
      style: 'font-size: 24px; margin: 0 15px; min-width: 40px; text-align: center;' 
    }, String(safeCount)),
    jsx('button', { 
      onClick: () => {
        // Wrap in Result for error handling
        Result.fromTry(() => onIncrement())
          .map(() => console.log('Increment successful'))
          .chain(result => result.type === 'Error' 
            ? Either.Left(`Increment error: ${result.error.message}`)
            : Either.Right(result));
      },
      style: 'font-size: 16px; padding: 5px 10px; margin: 5px; cursor: pointer;'
    }, '+')
  ]);
};

// Error fallback component
const CounterErrorFallback = (error) => {
  return jsx('div', {
    style: 'color: red; padding: 10px; border: 1px solid red; margin: 10px; border-radius: 4px;'
  }, [
    jsx('h3', null, 'Counter Error'),
    jsx('p', null, `Something went wrong: ${error?.message || 'Unknown error'}`),
    jsx('button', {
      onClick: () => window.location.reload(),
      style: 'padding: 5px 10px; margin-top: 10px; cursor: pointer;'
    }, 'Reload Page')
  ]);
};

// Create error boundary for counter
const CounterWithErrorBoundary = createErrorBoundary(CounterErrorFallback);

// Safe state update functions
const safeIncrement = () => {
  return Result.fromTry(() => {
    store.update(count => 
      count.chain(value => Maybe.Just(increment(value)))
    );
  });
};

const safeDecrement = () => {
  return Result.fromTry(() => {
    store.update(count => 
      count.chain(value => Maybe.Just(decrement(value)))
    );
  });
};

// Initialize the application with error handling
const initCounter = (containerId) => {
  return Result.fromTry(() => {
    const container = document.getElementById(containerId);
    
    if (!container) {
      throw new Error(`Container element with id '${containerId}' not found`);
    }

    // Setup global error handling
    const cleanupGlobalErrors = setupGlobalErrorHandler();

    // Subscribe to state changes and render with error boundary
    const unsubscribe = store.subscribe(count => {
      const counterElement = Counter({
        count,
        onIncrement: () => {
          const result = safeIncrement();
          if (result.type === 'Error') {
            console.error('Increment failed:', result.error);
          }
        },
        onDecrement: () => {
          const result = safeDecrement();
          if (result.type === 'Error') {
            console.error('Decrement failed:', result.error);
          }
        }
      });

      // Wrap counter in error boundary as specified in README
      const safeCounterElement = CounterWithErrorBoundary({
        children: counterElement
      });

      const renderResult = render(safeCounterElement, container);

      // Handle render errors
      if (renderResult.type === 'Error') {
        console.error('Render failed:', renderResult.error);
        // Fallback: show error message directly
        container.innerHTML = `<div style="color: red;">Render Error: ${renderResult.error.message}</div>`;
      }
    });

    // Initial render
    const initialRenderResult = Result.fromTry(() => {
      store.update(count => count);
    });

    if (initialRenderResult.type === 'Error') {
      console.error('Initial render failed:', initialRenderResult.error);
      return Either.Left(initialRenderResult.error);
    }

    // Return cleanup function
    return Either.Right(() => {
      unsubscribe();
      cleanupGlobalErrors();
    });
  }).fold(
    error => {
      console.error('Counter initialization failed:', error);
      return Either.Left(error);
    },
    result => result
  );
};

export default initCounter; 