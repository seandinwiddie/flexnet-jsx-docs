// Determine the base path based on the hostname.
// For local development, the base path is empty.
// For the deployed GitHub Pages site, it's the repository name.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BASE_PATH = isLocal ? '' : '/flexnet-jsx-docs'; 