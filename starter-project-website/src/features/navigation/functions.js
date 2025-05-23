// Navigation utility functions
import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';

// Navigation state
const navigationState = {
    currentPage: 'home',
    isMenuOpen: false
};

// Navigation route mapping
const routes = {
    home: 'homepage',
    services: 'services', 
    about: 'about',
    contact: 'contact',
    faqs: 'faqs',
    mission: 'mission'
};

// Get current page
const getCurrentPage = () => {
    console.log(`[Navigation] Getting current page: ${navigationState.currentPage}`);
    return Maybe.Just(navigationState.currentPage);
};

// Set current page
const setCurrentPage = (page) => {
    console.log(`[Navigation] Attempting to set page to: ${page}`);
    const validPage = routes[page];
    if (validPage) {
        navigationState.currentPage = page;
        console.log(`[Navigation] Successfully set current page to: ${page}`);
        return Either.Right(page);
    }
    console.error(`[Navigation] Invalid page requested: ${page}. Valid pages: ${Object.keys(routes).join(', ')}`);
    return Either.Left(`Invalid page: ${page}`);
};

// Toggle mobile menu
const toggleMenu = () => {
    navigationState.isMenuOpen = !navigationState.isMenuOpen;
    console.log(`[Navigation] Mobile menu toggled to: ${navigationState.isMenuOpen ? 'open' : 'closed'}`);
    return Maybe.Just(navigationState.isMenuOpen);
};

// Get menu items (updated for path-based routing)
const getMenuItems = () => Maybe.Just([
    { id: 'home', label: 'Home', href: '/public/' },
    { id: 'services', label: 'Services/Offer', href: '/public/services' },
    { id: 'about', label: 'About', href: '/public/about' },
    { id: 'contact', label: 'Contact', href: '/public/contact' },
    { id: 'faqs', label: 'FAQs', href: '/public/faqs' },
    { id: 'mission', label: 'Mission', href: '/public/mission' }
]);

// Navigation click handler (updated for path-based routing)
const handleNavigation = (pageId) => {
    console.log(`[Navigation] Handling navigation to: ${pageId}`);
    
    return setCurrentPage(pageId)
        .map(page => {
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update browser URL without page reload using path-based routing
            if (window.history && window.history.pushState) {
                const newPath = page === 'home' ? '/public/' : `/public/${page}`;
                console.log(`[Navigation] Updating URL to: ${newPath}`);
                window.history.pushState({ page }, '', newPath);
            }
            
            return page;
        });
};

// Get page from URL path (updated for path-based routing)
const getPageFromPath = () => {
    const pathname = window.location.pathname;
    console.log(`[Navigation] Getting page from current path: ${pathname}`);
    
    // Handle different path patterns
    if (pathname === '/public/' || pathname === '/public') {
        console.log(`[Navigation] Path matches home page`);
        return Maybe.Just('home');
    }
    
    // Extract page from path like /public/services
    const pathParts = pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    if (lastPart && routes[lastPart]) {
        console.log(`[Navigation] Path matches page: ${lastPart}`);
        return Maybe.Just(lastPart);
    }
    
    console.log(`[Navigation] Path does not match any known page, defaulting to home. Path: ${pathname}`);
    return Maybe.Just('home');
};

// Handle browser back/forward navigation
const handlePopState = () => {
    console.log(`[Navigation] Browser back/forward navigation detected`);
    const pageFromPath = getPageFromPath();
    
    pageFromPath.map(page => {
        console.log(`[Navigation] Setting page from browser navigation: ${page}`);
        setCurrentPage(page);
        // Trigger a re-render by dispatching a custom event
        window.dispatchEvent(new CustomEvent('navigationChange', { detail: { page } }));
    });
};

// Initialize path-based routing
const initializeRouting = () => {
    console.log(`[Navigation] Initializing path-based routing`);
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    
    // Set initial page based on current URL
    const initialPage = getPageFromPath();
    initialPage.map(page => {
        console.log(`[Navigation] Setting initial page from URL: ${page}`);
        setCurrentPage(page);
    });
    
    console.log(`[Navigation] Path-based routing initialized successfully`);
};

// Export the remaining functions that don't have individual exports
export {
    getCurrentPage,
    setCurrentPage,
    toggleMenu,
    getMenuItems,
    handleNavigation,
    getPageFromPath,
    handlePopState,
    initializeRouting,
    navigationState
}; 