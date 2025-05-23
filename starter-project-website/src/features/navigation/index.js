import { jsx } from '../../core/runtime/jsx.js';
import { getMenuItems, handleNavigation, getCurrentPage } from './functions.js';
import { escape } from '../../core/security/functions.js';
import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';

// Safe click handler with better logging
const safeOnClick = (callback, context = '') => {
    return (e) => {
        try {
            e.preventDefault();
            console.log(`[Navigation] Click event triggered${context ? ` for ${context}` : ''}`);
            const result = Result.fromTry(callback);
            if (result && result.type === 'Error') {
                console.error(`[Navigation] Navigation error${context ? ` for ${context}` : ''}:`, result.error);
            } else {
                console.log(`[Navigation] Navigation successful${context ? ` for ${context}` : ''}`);
            }
        } catch (error) {
            console.error(`[Navigation] Critical navigation error${context ? ` for ${context}` : ''}:`, error);
        }
    };
};

// Navigation component as pure function
const Navigation = ({ currentPage, onNavigate }) => {
    console.log(`[Navigation] Rendering navigation for current page: ${currentPage}`);
    const menuItems = getMenuItems().getOrElse([]);
    console.log(`[Navigation] Menu items loaded:`, menuItems.map(item => item.id));
    
    const headerStyle = {
        backgroundColor: 'hsl(240 10% 3.9%)', // --background (matches body)
        color: 'hsl(0 0% 98%)', // --foreground
        borderBottom: '1px solid hsl(240 3.7% 15.9%)' // --border
    };

    const navLinkStyle = {
        color: 'hsl(0 0% 98%)' // --foreground
    };

    const activeButtonStyle = {
        backgroundColor: 'hsl(240 3.7% 15.9%)', // --accent
        color: 'hsl(0 0% 98%)' // --accent-foreground
    };

    const inactiveButtonStyle = {
        color: 'hsl(240 5% 64.9%)' // --muted-foreground
    };
    
    // Note: Tailwind classes like 'fixed', 'shadow-md', 'container', 'flex', etc., are kept for layout.
    return jsx('header', { 
        className: 'fixed top-0 left-0 right-0 shadow-md z-50',
        style: headerStyle
    }, [
        jsx('nav', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'
        }, [
            jsx('a', {
                href: '/public/',
                className: 'text-xl font-bold transition-colors', // Removed hover:text-zinc-300, hover will be via style if needed
                style: navLinkStyle, // Explicit color
                onClick: safeOnClick(() => onNavigate('home'))
            }, 'Lorem Ipsum'),
            jsx('ul', {
                className: 'flex space-x-4'
            }, menuItems.map(item => 
                jsx('li', { key: item.id }, [
                    jsx('button', {
                        onClick: safeOnClick(() => onNavigate(item.id)),
                        className: 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                        style: currentPage === item.id ? activeButtonStyle : inactiveButtonStyle
                        // Consider adding hover styles directly via JS if Tailwind's hover:bg-zinc-800 etc. is not precise enough
                    }, item.label)
                ])
            ))
        ])
    ]);
};

export default Navigation; 