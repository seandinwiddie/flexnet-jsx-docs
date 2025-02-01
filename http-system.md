# FlexNet JSX Framework - HTTP System

## Overview
The HTTP system provides a functional implementation for making HTTP requests. It follows the FlexNet JSX Framework's core principles:
- Functional programming
- Zero external dependencies
- Immutable state management
- Effect isolation

## Core Types

### Request Type
```javascript
Request = Method -> URL -> Headers -> Body -> Timeout -> Retry -> Cache -> Either Error Request
```

### Response Type
```javascript
Response = Data -> Status -> Headers -> Either Error Response
```

### Cache Type
```javascript
Cache = Entries -> MaxAge -> MaxSize -> Either Error Cache
```

### Interceptor Type
```javascript
Interceptor = (Request -> Either Error Request) -> (Response -> Either Error Response) -> (Error -> Either Error Error) -> Either Error Interceptor
```

## HTTP Client API

### Creating a Client
```javascript
const client = createHTTPClient(baseURL)(options);
```

### Making Requests
```javascript
// GET request
client.get(url)(headers)(timeout)(retry)(cache);

// POST request
client.post(url)(data)(headers)(timeout)(retry)(cache);

// PUT request
client.put(url)(data)(headers)(timeout)(retry)(cache);

// DELETE request
client.delete(url)(headers)(timeout)(retry)(cache);
```

### Using Interceptors
```javascript
// Add request interceptor
client.addRequestInterceptor(request => 
  Either.Right({ ...request, headers: { ...request.headers, 'X-Custom': 'value' } })
);

// Add response interceptor
client.addResponseInterceptor(response =>
  Either.Right({ ...response, data: transformData(response.data) })
);

// Add error interceptor
client.addErrorInterceptor(error =>
  error.status === 401 ? refreshToken().chain(() => retry(error.request)) : Either.Left(error)
);
```

### Cache Operations
```javascript
// Get current cache state
const cache = client.getCache();

// Clear cache
client.clearCache();
```

## Type Verification

All types include strict verification:
- Request verification ensures valid method, URL, headers, timeout, retry config
- Response verification ensures valid status code, headers, data format
- Cache verification ensures valid entries, max age, max size
- Interceptor verification ensures valid function types

## Error Handling

All operations return Either type for proper error handling:
```javascript
client.get('/api/data')(headers)(timeout)(retry)(cache)
  .map(response => processData(response.data))
  .mapLeft(error => logError(error));
```

## Effect Isolation

All side effects (network requests, cache operations) are properly isolated in the effect system using functional composition.
