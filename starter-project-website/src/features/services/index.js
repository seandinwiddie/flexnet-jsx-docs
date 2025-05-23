import { jsx } from '../../core/runtime/jsx.js';
import { 
    getPageTitleContent,
    getServicesContent,
    getAIIntegrationContent,
    getPricingPackagesContent,
    getConsultationCTAContent
} from './functions.js';
import { escape } from '../../core/security/functions.js';

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
    innerCard: { // For cards within cards, like service items or pricing packages
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
    }
};

// Safe button click handler
const safeButtonClick = (callback) => {
    return () => {
        try {
            callback();
        } catch (error) {
            console.error('Button click error:', error);
        }
    };
};

// Page Title Section - Updated to match homepage hero structure
const PageTitleSection = () => {
    const content = getPageTitleContent().getOrElse({});
    
    return jsx('section', { 
        className: 'py-20 md:py-28' // Similar to HeroSection vertical padding
    }, [
        jsx('div', {
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 text-center p-10 md:p-16 rounded-lg shadow-xl', // Centered card
            style: styles.card 
        }, [
            jsx('h1', {
                className: 'text-4xl sm:text-5xl md:text-6xl font-bold mb-6',
                style: styles.textPrimary
            }, escape(content.title || '')),
            jsx('p', { 
                className: 'text-xl md:text-2xl', // Removed mb-8 as it's the last element
                style: styles.textMuted
            }, escape(content.subtitle || ''))
        ])
    ]);
};

// Individual Service Section - Updated for card layout
const ServiceSection = ({ service, onNavigate }) => {
    return jsx('section', { 
        className: 'py-12 md:py-16' // Consistent vertical padding for sections
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl p-8 rounded-lg shadow-lg', // Card style for each service
            style: styles.card
        }, [
            jsx('div', { className: 'text-center mb-6' }, [ // Service header items centered
                // Icon removed as per earlier decision to remove emojis. Placeholder can be added if a new icon system is in place.
                // jsx('div', { className: 'service-icon mb-4 text-4xl', style: styles.textPrimary }, service.icon || '♢'), // Example non-emoji icon
                jsx('h2', { 
                    className: 'text-3xl sm:text-4xl font-bold',
                    style: styles.textPrimary
                }, escape(service.title || ''))
            ]),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-6', // Adjusted for readability
                style: styles.textMuted
            }, escape(service.description || '')),
            jsx('ul', { 
                className: 'space-y-3 mb-8' // Spacing for list items
            }, 
                (service.features || []).map((feature, index) => 
                    jsx('li', { 
                        key: index,
                        className: 'flex items-start p-3 rounded-md', // Slightly less padding for inner items
                        style: { ...styles.innerCard, padding: '0.75rem' } // Using innerCard style
                    }, [
                        jsx('span', { 
                            className: 'flex-shrink-0 mr-3 font-bold text-xl', // Adjusted size
                            style: { color: '#667eea' } // Brand purple for list marker
                        }, '>'),
                        jsx('span', { style: styles.textPrimary }, escape(feature))
                    ])
                )
            ),
            jsx('div', { 
                className: 'flex flex-wrap justify-center gap-4' // Centered buttons
            }, [
                jsx('button', {
                    onClick: safeButtonClick(() => onNavigate('contact')),
                    className: 'font-semibold px-6 py-3 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105',
                    style: styles.buttonPrimary 
                }, 'Learn More'),
                jsx('button', {
                    onClick: safeButtonClick(() => onNavigate('contact')),
                    className: 'font-semibold px-6 py-3 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105',
                    style: styles.buttonSecondary
                }, 'Get Started')
            ])
        ])
    ]);
};

// AI Integration Section - Updated for card layout
const AIIntegrationSection = () => {
    const content = getAIIntegrationContent().getOrElse({});
    
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
                className: 'text-lg leading-relaxed mb-8',
                style: styles.textMuted
            }, escape(content.description || '')),
            jsx('ul', { 
                className: 'space-y-3 text-left' // Benefits list left-aligned within the centered card
            },
                (content.benefits || []).map((benefit, index) => 
                    jsx('li', { 
                        key: index,
                        className: 'flex items-start p-3 rounded-md',
                        style: { ...styles.innerCard, padding: '0.75rem' }
                    }, [
                         jsx('span', { 
                            className: 'flex-shrink-0 mr-3 font-bold text-xl',
                            style: { color: '#667eea' } 
                        }, '>'),
                        jsx('span', { style: styles.textPrimary }, escape(benefit))
                    ])
                )
            )
        ])
    ]);
};

// Pricing Packages Section - Updated for card layout
const PricingPackagesSection = ({ onNavigate }) => {
    const content = getPricingPackagesContent().getOrElse({});
        
    return jsx('section', { 
        className: 'py-12 md:py-20'
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 p-8 rounded-lg shadow-lg', // Main card for the section
            style: styles.card 
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-10 md:mb-12 text-center',
                style: styles.textPrimary
            }, escape(content.heading || '')),
            jsx('div', { 
                className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' // Responsive grid for packages
            },
                (content.packages || []).map((pkg, index) => 
                    jsx('div', { 
                        key: index,
                        className: `rounded-lg shadow-md p-6 flex flex-col text-center ${pkg.featured ? 'ring-2 ring-purple-500' : ''}`, // Featured package highlight
                        style: styles.innerCard // Each package is an inner card
                    }, [
                        jsx('h3', { 
                            className: 'text-2xl font-semibold mb-4',
                            style: styles.textPrimary
                        }, escape(pkg.name || '')),
                        jsx('ul', { 
                            className: 'space-y-2 mb-6 text-left flex-grow' // Features list
                        },
                            (pkg.features || []).map((feature, featureIndex) => 
                                jsx('li', { 
                                    key: featureIndex,
                                    className: 'flex items-center'
                                }, [
                                    jsx('span', { 
                                        className: 'text-green-400 mr-2 text-xl' // Using a checkmark color, can be replaced with HSL
                                    }, '✓'), // Checkmark, can be replaced or styled
                                    jsx('span', {style: styles.textMuted}, escape(feature))
                                ])
                            )
                        ),
                        jsx('button', {
                            onClick: safeButtonClick(() => onNavigate('contact')),
                            className: 'font-semibold px-6 py-3 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105 mt-auto', // mt-auto pushes button to bottom
                            style: pkg.featured ? styles.buttonPrimary : styles.buttonSecondary // Different style for featured package button
                        }, 'Get Started')
                    ])
                )
            )
        ])
    ]);
};

// Consultation CTA Section - Updated for card layout
const ConsultationCTASection = ({ onNavigate }) => {
    const content = getConsultationCTAContent().getOrElse({});
    
    return jsx('section', { 
        className: 'py-16 md:py-24' // Prominent vertical padding for CTA
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 text-center p-10 md:p-16 rounded-lg shadow-xl', // Large card for CTA
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
            jsx('button', {
                onClick: safeButtonClick(() => onNavigate('contact')),
                className: 'font-semibold px-8 py-4 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105 text-lg', // Larger button
                style: styles.buttonPrimary 
            }, 'Schedule Consultation')
        ])
    ]);
};

// Main Services Page Component
const ServicesPage = ({ onNavigate }) => {
    const servicesContent = getServicesContent().getOrElse({});
    
    // pt-16 to account for fixed navigation bar
    return jsx('div', { className: 'pt-16 main-content services-page' }, [ 
        PageTitleSection(),
        // Render all service sections
        ...(servicesContent.services || []).map((service, index) => 
            ServiceSection({ service, onNavigate, key: service.id || index }) // Added key
        ),
        AIIntegrationSection(),
        PricingPackagesSection({ onNavigate }),
        ConsultationCTASection({ onNavigate })
    ]);
};

export default ServicesPage; 