import { jsx, render } from '../../core/runtime/jsx.js';
import { 
    getHeroContent,
    getDigitalTransformationContent,
    getWeb3Content,
    getCoreServicesContent,
    getWhyCryptoVersusContent,
    getCTAContent,
    handleCTAClick,
    getKeyPrioritiesContent,
    getTeamContent
} from './functions.js';
import Navigation from '../navigation/index.js';
import { getCurrentPage, handleNavigation, initializeRouting, getPageFromPath } from '../navigation/functions.js';
import { createStore } from '../../systems/state/store.js';
import { escape } from '../../core/security/functions.js';
import { createErrorBoundary, setupGlobalErrorHandler } from '../../systems/errors/boundary.js';
import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';
import Either from '../../core/types/either.js';

// Import all page components
import ServicesPage from '../services/index.js';
import AboutPage from '../about/index.js';
import ContactPage from '../contact/index.js';
import FAQsPage from '../faqs/index.js';
import MissionPage from '../mission/index.js';

// Create store for page state
const pageStore = createStore(Maybe.Just({ currentPage: 'home' }));

// Define HSL styles for shadcn/ui dark theme
const styles = {
    card: {
        backgroundColor: 'hsl(240 4.8% 9.5%)', // --card
        borderColor: 'hsl(240 3.7% 15.9%)',   // --border
        borderWidth: '1px',
        borderStyle: 'solid'
    },
    textPrimary: { // For main headings, important text
        color: 'hsl(0 0% 98%)' // --foreground
    },
    textMuted: { // For paragraphs, less important text
        color: 'hsl(240 5% 64.9%)' // --muted-foreground
    },
    innerCard: { // For cards within cards, like service items
        backgroundColor: 'hsl(240 3.7% 15.9%)', // --accent or a slightly darker card variant
        borderColor: 'hsl(240 3.7% 20%)', // A slightly different border for inner cards
        borderWidth: '1px',
        borderStyle: 'solid'
    },
    buttonPrimary: {
        backgroundColor: '#667eea', // Keeping brand purple --cv-primary-500
        color: 'hsl(0 0% 98%)', // --primary-foreground (ensure high contrast)
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderColor: 'hsl(240 3.7% 15.9%)', // --border
        borderWidth: '1px',
        borderStyle: 'solid',
        color: 'hsl(0 0% 98%)' // --foreground (for text on transparent button)
    },
    // Hover for secondary button can be managed with JS event handlers or kept simpler
    // For now, let's rely on Tailwind's hover transition for visual feedback if any
};

// Safe navigation handler with better error checking
const safeNavigate = (pageId) => {
    console.log(`[Homepage] Safe navigate called for page: ${pageId}`);
    return Result.fromTry(() => {
        if (!pageId) {
            throw new Error('Page ID is required');
        }
        
        pageStore.update(state => 
            state.chain(pageState => {
                console.log(`[Homepage] Updating store state to page: ${pageId}`);
                return Maybe.Just({ ...pageState, currentPage: pageId });
            })
        );
        
        const navResult = handleNavigation(pageId);
        if (navResult && navResult.type === 'Left') {
            throw new Error(`Navigation failed: ${navResult.value}`);
        }
        
        console.log(`[Homepage] Navigation completed successfully for page: ${pageId}`);
        return navResult;
    });
};

// Safe button click handler
const safeButtonClick = (callback) => {
    return () => {
        const result = Result.fromTry(callback);
        if (result && result.type === 'Error') {
            console.error('Button click error:', result.error);
        }
    };
};

// Hero Section Component
const HeroSection = ({ onNavigate }) => {
    const content = getHeroContent().getOrElse({});
    
    return jsx('section', { 
        className: 'py-20 md:py-28'
    }, [
        jsx('div', {
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 text-zinc-50 text-center p-10 md:p-16 rounded-lg shadow-xl',
            style: styles.card
        }, [
            jsx('h1', { 
                className: 'text-4xl sm:text-5xl md:text-6xl font-bold mb-6',
                style: styles.textPrimary
            }, escape(content.headline || '')),
            jsx('p', { 
                className: 'text-xl md:text-2xl mb-8',
                style: styles.textMuted
            }, escape(content.tagline || '')),
            jsx('p', { 
                className: 'text-lg md:text-xl max-w-3xl mx-auto mb-10',
                style: styles.textMuted
            }, escape(content.description || '')),
            jsx('div', { 
                className: 'flex flex-wrap justify-center gap-4'
            }, [
                jsx('button', {
                    onClick: safeButtonClick(() => onNavigate('contact')),
                    className: 'font-semibold px-8 py-3 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105',
                    style: styles.buttonPrimary
                }, 'Get Started'),
                jsx('button', {
                    onClick: safeButtonClick(() => onNavigate('services')),
                    className: 'font-semibold px-8 py-3 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105',
                    style: styles.buttonSecondary
                }, 'Learn More')
            ])
        ])
    ]);
};

// Digital Transformation Section
const DigitalTransformationSection = () => {
    const content = getDigitalTransformationContent().getOrElse({});
    
    return jsx('section', { 
        className: 'py-12 md:py-20'
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center p-8 rounded-lg shadow-lg',
            style: styles.card
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-6',
                style: styles.textPrimary
            }, escape(content.heading || '')),
            jsx('p', { 
                className: 'text-lg leading-relaxed',
                style: styles.textMuted
            }, escape(content.content || ''))
        ])
    ]);
};

// Web3 Benefits Section
const Web3Section = () => {
    const content = getWeb3Content().getOrElse({});
    
    return jsx('section', { 
        className: 'py-12 md:py-20'
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl p-8 rounded-lg shadow-lg',
            style: styles.card
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-6 text-center',
                style: styles.textPrimary
            }, escape(content.heading || '')),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-8',
                style: styles.textMuted
            }, escape(content.description || '')),
            jsx('ul', { 
                className: 'space-y-4'
            }, 
                (content.benefits || []).map((benefit, index) => 
                    jsx('li', {
                        key: index, 
                        className: 'flex items-start p-4 rounded-lg shadow-md',
                        style: styles.innerCard
                    }, [
                        jsx('span', { 
                            className: 'flex-shrink-0 mr-3 font-bold text-2xl',
                            style: { color: '#667eea' }
                        }, '>'),
                        jsx('span', { 
                            style: styles.textPrimary
                        }, escape(benefit))
                    ])
                )
            )
        ])
    ]);
};

// Core Services Section
const CoreServicesSection = () => {
    const content = getCoreServicesContent().getOrElse({});
    
    return jsx('section', { 
        className: 'py-12 md:py-20'
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 p-8 rounded-lg shadow-lg',
            style: styles.card
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-10 md:mb-12 text-center',
                style: styles.textPrimary
            }, escape(content.heading || '')),
            jsx('div', { 
                className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
            },
                (content.services || []).map(service => 
                    jsx('article', {
                        key: service.id,
                        className: 'rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300',
                        style: styles.innerCard
                    }, [
                        jsx('header', { className: 'mb-4' }, [
                            jsx('h3', { 
                                className: 'text-xl font-semibold mt-2',
                                style: styles.textPrimary
                            }, escape(service.title || ''))
                        ]),
                        jsx('p', { 
                            className: 'text-sm leading-relaxed',
                            style: styles.textMuted
                        }, escape(service.description || ''))
                    ])
                )
            )
        ])
    ]);
};

// Why CryptoVersus Section
const WhyCryptoVersusSection = () => {
    const content = getWhyCryptoVersusContent().getOrElse({});
    
    return jsx('section', { 
        className: 'py-12 md:py-20'
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 p-8 rounded-lg shadow-lg',
            style: styles.card
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-10 md:mb-12 text-center',
                style: styles.textPrimary
            }, escape(content.heading || '')),
            jsx('div', { 
                className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
            }, (content.benefits || []).map((benefit, index) => jsx('div', {
                key: index,
                className: 'p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow',
                style: styles.innerCard
            }, [
                jsx('h3', { 
                    className: 'text-xl font-semibold mb-3',
                    style: styles.textPrimary
                }, escape(benefit.title || '')),
                jsx('p', { 
                    className: 'leading-relaxed',
                    style: styles.textMuted
                }, escape(benefit.description || ''))
            ])))
        ])
    ]);
};

// CTA Section
const CTASection = ({ onNavigate }) => {
    const content = getCTAContent().getOrElse({});
    
    return jsx('section', { 
        className: 'py-16 md:py-24'
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 text-center p-10 md:p-16 rounded-lg shadow-xl',
            style: styles.card
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-6',
                style: styles.textPrimary
            }, escape(content.heading || '')),
            jsx('p', { 
                className: 'text-lg md:text-xl max-w-2xl mx-auto mb-8',
                style: styles.textMuted
            }, escape(content.description || '')),
            jsx('div', { 
                className: 'flex flex-wrap justify-center gap-4'
            }, (content.buttons || []).map((button, index) => jsx('button', {
                key: index,
                onClick: safeButtonClick(() => {
                    const result = handleCTAClick(button.action, onNavigate);
                    if (result && result.type === 'Error') {
                        console.error('CTA click error:', result.error);
                    }
                }),
                className: 'font-semibold px-8 py-3 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105',
                style: button.type === 'primary' ? styles.buttonPrimary : styles.buttonSecondary
            }, escape(button.text || ''))))
        ])
    ]);
};

// Footer Component
const Footer = () => {
    const currentYear = new Date().getFullYear();
    const footerStyle = {
        backgroundColor: 'hsl(240 4.8% 9.5%)',
        color: 'hsl(240 5% 64.9%)',
        borderTop: '1px solid hsl(240 3.7% 15.9%)'
    };
    const linkStyle = {
        color: 'hsl(0 0% 98%)'
    };

    return jsx('footer', {
        className: 'py-8 text-center',
        style: footerStyle
    }, [
        jsx('div', { className: 'container mx-auto px-4 sm:px-6 lg:px-8' }, [
            jsx('p', {}, `© ${currentYear} CryptoVersus.io. All rights reserved.`),
            jsx('p', { className: 'mt-2 text-sm' }, [
                jsx('a', { href: '#', onClick: (e) => { e.preventDefault(); safeNavigate('home'); }, className: 'hover:underline px-2', style: linkStyle }, 'Home'),
                '|',
                jsx('a', { href: '#', onClick: (e) => { e.preventDefault(); safeNavigate('services'); }, className: 'hover:underline px-2', style: linkStyle }, 'Services'),
                '|',
                jsx('a', { href: '#', onClick: (e) => { e.preventDefault(); safeNavigate('about'); }, className: 'hover:underline px-2', style: linkStyle }, 'About Us'),
                '|',
                jsx('a', { href: '#', onClick: (e) => { e.preventDefault(); safeNavigate('contact'); }, className: 'hover:underline px-2', style: linkStyle }, 'Contact'),
                '|',
                jsx('a', { href: '#', onClick: (e) => { e.preventDefault(); safeNavigate('mission'); }, className: 'hover:underline px-2', style: linkStyle }, 'Mission'),
                '|',
                jsx('a', { href: '#', onClick: (e) => { e.preventDefault(); safeNavigate('faqs'); }, className: 'hover:underline px-2', style: linkStyle }, 'FAQs')
            ])
        ])
    ]);
};

// Main Homepage Component
const Homepage = ({ currentPage, onNavigate }) => {
    return jsx('div', { className: 'pt-16' }, [
        HeroSection({ onNavigate }),
        DigitalTransformationSection(),
        Web3Section(),
        CoreServicesSection(),
        WhyCryptoVersusSection(),
        CTASection({ onNavigate })
    ]);
};

// Error fallback component
const HomepageErrorFallback = (error) => {
    return jsx('div', {
        style: 'color: red; padding: 20px; border: 1px solid red; margin: 20px; border-radius: 4px;'
    }, [
        jsx('h3', null, 'Homepage Error'),
        jsx('p', null, `Something went wrong: ${error?.message || 'Unknown error'}`),
        jsx('button', {
            onClick: () => window.location.reload(),
            style: 'padding: 10px 20px; margin-top: 10px; cursor: pointer;'
        }, 'Reload Page')
    ]);
};

// Create error boundary for homepage
const HomepageWithErrorBoundary = createErrorBoundary(HomepageErrorFallback);

// Website App Component with improved error handling
const WebsiteApp = ({ currentPage }) => {
    const handleNavigate = (pageId) => {
        try {
            const result = safeNavigate(pageId);
            if (result && result.type === 'Error') {
                console.error('Navigation failed:', result.error);
                // Don't throw, just log the error
            }
        } catch (error) {
            console.error('Critical navigation error:', error);
        }
    };

    // Render the appropriate page component based on currentPage
    const renderPageComponent = () => {
        switch (currentPage) {
            case 'home':
                return Homepage({ currentPage, onNavigate: handleNavigate });
            case 'services':
                return ServicesPage({ onNavigate: handleNavigate });
            case 'about':
                return AboutPage({ onNavigate: handleNavigate });
            case 'contact':
                return ContactPage({ onNavigate: handleNavigate });
            case 'faqs':
                return FAQsPage({ onNavigate: handleNavigate });
            case 'mission':
                return MissionPage({ onNavigate: handleNavigate });
            default:
                // Fallback for unknown pages
                return jsx('div', { className: 'section' }, [
                    jsx('div', { className: 'container' }, [
                        jsx('h2', null, `Page Not Found`),
                        jsx('p', null, 'The requested page could not be found.'),
                        jsx('button', {
                            className: 'btn',
                            onClick: safeButtonClick(() => handleNavigate('home'))
                        }, 'Return Home')
                    ])
                ]);
        }
    };

    return jsx('div', null, [
        Navigation({ currentPage, onNavigate: handleNavigate }),
        jsx('main', null, [
            renderPageComponent(),
            Footer()
        ])
    ]);
};

// Initialize the website with better error handling
const initWebsite = (containerId) => {
    console.log(`[Homepage] Initializing website with container ID: ${containerId}`);
    
    return Result.fromTry(() => {
        const container = document.getElementById(containerId);
        
        if (!container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        console.log(`[Homepage] Container element found successfully`);

        // Initialize path-based routing
        console.log(`[Homepage] Setting up path-based routing...`);
        initializeRouting();

        // Setup global error handling
        console.log(`[Homepage] Setting up global error handlers...`);
        const cleanupGlobalErrors = setupGlobalErrorHandler();

        // Get initial page from URL path instead of hash
        console.log(`[Homepage] Determining initial page from URL...`);
        const initialPage = getPageFromPath().getOrElse('home');
        console.log(`[Homepage] Initial page determined: ${initialPage}`);

        // Listen for navigation change events
        window.addEventListener('navigationChange', (event) => {
            console.log(`[Homepage] Navigation change event received for page: ${event.detail.page}`);
            pageStore.update(state => 
                state.chain(pageState => Maybe.Just({ ...pageState, currentPage: event.detail.page }))
            );
        });

        // Subscribe to state changes and render
        console.log(`[Homepage] Setting up store subscription...`);
        const unsubscribe = pageStore.subscribe(pageState => {
            try {
                const currentPageData = pageState.getOrElse({ currentPage: 'home' });
                console.log(`[Homepage] Rendering page: ${currentPageData.currentPage}`);
                
                const websiteElement = WebsiteApp({ currentPage: currentPageData.currentPage });

                // Wrap in error boundary
                const safeWebsiteElement = HomepageWithErrorBoundary({
                    children: websiteElement
                });

                const renderResult = render(safeWebsiteElement, container);

                // Handle render errors more gracefully
                if (renderResult && renderResult.type === 'Left') {
                    console.error(`[Homepage] Render failed for page ${currentPageData.currentPage}:`, renderResult.value);
                    container.innerHTML = `<div style="color: red; padding: 20px;">Render Error: ${renderResult.value}</div>`;
                } else {
                    console.log(`[Homepage] Page ${currentPageData.currentPage} rendered successfully`);
                }
            } catch (error) {
                console.error(`[Homepage] Critical render error for page:`, error);
                container.innerHTML = `<div style="color: red; padding: 20px;">Critical Error: ${error.message}</div>`;
            }
        });

        // Initial render with error handling
        try {
            console.log(`[Homepage] Triggering initial render...`);
            pageStore.update(state => {
                return state.chain(pageState => Maybe.Just({ ...pageState, currentPage: initialPage }));
            });
            console.log(`[Homepage] Initial render triggered successfully`);
        } catch (error) {
            console.error(`[Homepage] Initial render failed:`, error);
            return Either.Left(error);
        }

        console.log(`[Homepage] Website initialization completed successfully`);

        // Return cleanup function
        return Either.Right(() => {
            console.log(`[Homepage] Cleaning up website resources...`);
            if (unsubscribe) unsubscribe();
            if (cleanupGlobalErrors) cleanupGlobalErrors();
            window.removeEventListener('popstate', () => {}); // This will be handled by navigation
            console.log(`[Homepage] Cleanup completed`);
        });
    }).fold(
        error => {
            console.error(`[Homepage] Website initialization failed:`, error);
            return Either.Left(error);
        },
        result => result
    );
};

export default initWebsite; 