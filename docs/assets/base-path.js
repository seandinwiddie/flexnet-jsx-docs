// Determine the base path based on the hosting environment.
const hostname = window.location.hostname;
let BASE_PATH = '';

// For the default GitHub Pages URL (e.g., user.github.io/repo), the base path is the repo name.
if (hostname.includes('github.io')) {
    BASE_PATH = '/flexnet-jsx-docs';
}

// For localhost and custom domains, the base path is empty as they serve from the root. 