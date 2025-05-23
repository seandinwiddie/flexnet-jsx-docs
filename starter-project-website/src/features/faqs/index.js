import { jsx } from '../../core/runtime/jsx.js';
import { 
    getPageTitleContent,
    getSearchCategoriesContent,
    getFAQCategoriesContent,
    getContactContent,
    getResourcesContent
} from './functions.js';

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
    innerCard: { // For cards within cards, like FAQ items
        backgroundColor: 'hsl(240 3.7% 15.9%)', // --accent
        borderColor: 'hsl(240 3.7% 20%)', // A slightly different border
        borderWidth: '1px',
        borderStyle: 'solid'
    },
    buttonPrimary: {
        backgroundColor: '#667eea', // Brand purple
        color: 'hsl(0 0% 98%)', // High contrast text
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderColor: 'hsl(240 3.7% 15.9%)', // --border
        borderWidth: '1px',
        borderStyle: 'solid',
        color: 'hsl(0 0% 98%)' // --foreground
    },
    inputStyle: {
        backgroundColor: 'hsl(240 3.7% 15.9%)', // --input (or accent)
        borderColor: 'hsl(240 3.7% 25%)',
        color: 'hsl(0 0% 98%)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '0.375rem', // rounded-md
        padding: '0.5rem 0.75rem' // py-2 px-3
    },
    categoryTag: { // Style for category buttons
        backgroundColor: 'hsl(240 3.7% 15.9%)', // Accent
        color: 'hsl(0 0% 98%)', // Foreground
        padding: '0.25rem 0.75rem', // py-1 px-3
        borderRadius: '0.375rem', // rounded-md
        border: '1px solid hsl(240 3.7% 25%)'
    }
};

// Safe button click handler
const safeButtonClick = (callback, context = '') => {
    return (e) => {
        try {
            if (e && e.preventDefault) e.preventDefault();
            callback();
        } catch (error) {
            console.error(`Button click error${context ? ` for ${context}` : ''}:`, error);
        }
    };
};

// Page Title Section
const PageTitleSection = () => {
    const content = getPageTitleContent().getOrElse({});
    return jsx('section', { 
        className: 'py-20 md:py-28' 
    }, [
        jsx('div', {
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 text-center p-10 md:p-16 rounded-lg shadow-xl',
            style: styles.card 
        }, [
            jsx('h1', {
                className: 'text-4xl sm:text-5xl md:text-6xl font-bold mb-6',
                style: styles.textPrimary
            }, content.title || 'Lorem Ipsum Dolor Sit'),
            jsx('p', { 
                className: 'text-xl md:text-2xl',
                style: styles.textMuted
            }, content.subtitle || 'Lorem ipsum dolor sit amet consectetur.')
        ])
    ]);
};

// Search and Categories Section
const SearchCategoriesSection = () => {
    const content = getSearchCategoriesContent().getOrElse({});
    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        // Implement actual search filtering logic here
    };
    
    return jsx('section', { 
        className: 'py-12 md:py-16' 
    }, [
        jsx('div', {
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl p-8 rounded-lg shadow-lg',
            style: styles.card 
        }, [
            jsx('div', { className: 'mb-6' }, [
                jsx('input', {
                    type: 'text',
                    placeholder: 'Search FAQs...',
                    onInput: handleSearch,
                    className: 'w-full',
                    style: styles.inputStyle
                })
            ]),
            jsx('div', {}, [
                jsx('p', { 
                    className: 'text-lg font-semibold mb-3',
                    style: styles.textPrimary 
                }, 'Categories:'),
                jsx('div', { 
                    className: 'flex flex-wrap gap-2' 
                },
                    (content.categories || []).map((category, index) => 
                        jsx('button', {
                            key: index,
                            onClick: safeButtonClick(() => console.log('Filter by category:', category), 'category_filter'),
                            className: 'transition-colors duration-150', // Base for Tailwind hover if needed later
                            style: styles.categoryTag 
                        }, category)
                    )
                )
            ])
        ])
    ]);
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
    // Simple state for open/closed, ideally use a more robust state management for many items
    let isOpen = false; 

    const toggleAnswer = (event) => {
        const button = event.currentTarget;
        const answerEl = button.nextElementSibling;
        isOpen = !isOpen; // Toggle state
        answerEl.style.display = isOpen ? 'block' : 'none';
        button.querySelector('.indicator').textContent = isOpen ? '−' : '+';
    };
    
    return jsx('div', { 
        className: 'p-4 rounded-md',
        style: styles.innerCard 
    }, [
        jsx('button', {
            onClick: toggleAnswer,
            className: 'w-full flex justify-between items-center text-left font-semibold',
            style: styles.textPrimary
        }, [
            jsx('span', {}, question || ''),
            jsx('span', { 
                className: 'indicator text-xl',
                style: { color: 'hsl(240 5% 64.9%)' } // Muted foreground for +/- 
            }, '+')
        ]),
        jsx('div', {
            className: 'mt-2 faq-answer', // Added faq-answer for clarity
            style: { display: 'none', ...styles.textMuted }
        }, jsx('p', {className: 'leading-relaxed'}, answer || ''))
    ]);
};

// FAQ Categories Section
const FAQCategoriesSection = () => {
    const content = getFAQCategoriesContent().getOrElse({});
    return jsx('section', { 
        className: 'py-12 md:py-20' 
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 space-y-12' 
        }, 
            (content.categories || []).map((category, index) => 
                jsx('div', { 
                    key: index,
                    className: 'p-8 rounded-lg shadow-lg',
                    style: styles.card
                }, [
                    jsx('h2', { 
                        className: 'text-3xl sm:text-4xl font-bold mb-8 text-center',
                        style: styles.textPrimary
                    }, category.name || 'Category'),
                    jsx('div', { 
                        className: 'space-y-4' 
                    },
                        (category.questions || []).map((faq, faqIndex) => 
                            FAQItem({ 
                                question: faq.question, 
                                answer: faq.answer 
                            })
                        )
                    )
                ])
            )
        )
    ]);
};

// Contact Section
const ContactSection = ({ onNavigate }) => {
    const content = getContactContent().getOrElse({});
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
            }, content.heading || 'Lorem Ipsum Dolor Sit?'),
            jsx('p', { 
                className: 'text-lg md:text-xl max-w-2xl mx-auto mb-8',
                style: styles.textMuted
            }, content.description || ''),
            jsx('button', {
                onClick: safeButtonClick(() => onNavigate('contact'), 'faq_contact_us'),
                className: 'font-semibold px-8 py-4 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105 text-lg',
                style: styles.buttonPrimary
            }, 'Lorem Ipsum')
        ])
    ]);
};

// Resources Section
const ResourcesSection = () => {
    const content = getResourcesContent().getOrElse({});
    return jsx('section', { 
        className: 'py-12 md:py-20' 
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl p-8 rounded-lg shadow-lg text-center',
            style: styles.card 
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-6',
                style: styles.textPrimary
            }, content.heading || 'Explore Further'),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-8',
                style: styles.textMuted
            }, content.description || ''),
            jsx('ul', { 
                className: 'space-y-3' 
            }, (content.resources || []).map((resource, index) => 
                jsx('li', { 
                    key: index, 
                    className: 'p-3 rounded-md',
                    style: styles.innerCard
                }, [
                    jsx('a', { 
                        href: '#', // Placeholder, link to actual resource 
                        onClick: safeButtonClick(() => console.log('Navigate to resource:', resource), 'resource_link'),
                        className: 'font-semibold hover:underline',
                        style: styles.textPrimary
                    }, resource)
                ])
            ))
        ])
    ]);
};

// Main FAQs Page Component
const FAQsPage = ({ onNavigate }) => {
    return jsx('div', { className: 'pt-16 main-content faqs-page' }, [
        PageTitleSection(),
        SearchCategoriesSection(),
        FAQCategoriesSection(),
        ContactSection({ onNavigate }),
        ResourcesSection()
    ]);
};

export default FAQsPage; 