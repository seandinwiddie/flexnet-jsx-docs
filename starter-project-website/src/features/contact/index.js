import { jsx } from '../../core/runtime/jsx.js';
import { 
    getPageTitleContent,
    getContactOptionsContent,
    getDemoContent,
    getProjectConsultationContent,
    getFAQPreviewContent,
    getLocationsContent
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
        color: 'hsl(0 0% 98%)' // --foreground
    },
    inputStyle: {
        backgroundColor: 'hsl(240 3.7% 15.9%)', // --input (or accent)
        borderColor: 'hsl(240 3.7% 25%)', // Slightly lighter border for inputs
        color: 'hsl(0 0% 98%)', // --foreground
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '0.375rem', // Corresponds to rounded-md
        padding: '0.5rem 0.75rem' // py-2 px-3
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
            }, content.title || 'Contact Us'),
            jsx('p', { 
                className: 'text-xl md:text-2xl',
                style: styles.textMuted
            }, content.subtitle || 'Get in touch with our team.')
        ])
    ]);
};

// Contact Options Section
const ContactOptionsSection = () => {
    const content = getContactOptionsContent().getOrElse({});
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Contact form submitted');
        // Basic alert, replace with actual submission logic or UI feedback
        alert('Thank you for your message! We will get back to you soon.');
        event.target.reset(); // Reset form after submission
    };
    
    return jsx('section', { 
        className: 'py-12 md:py-20' 
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-start' 
        }, [
            // Contact Form Card
            jsx('div', { 
                className: 'p-8 rounded-lg shadow-lg',
                style: styles.card 
            }, [
                jsx('h2', { 
                    className: 'text-3xl font-bold mb-6',
                    style: styles.textPrimary
                }, content.formHeading || 'Send Us a Message'),
                jsx('form', { onSubmit: handleSubmit, className: 'space-y-6' }, [
                    jsx('div', { className: 'form-group' }, [
                        jsx('label', { 
                            htmlFor: 'name', 
                            className: 'block text-sm font-medium mb-1',
                            style: styles.textMuted
                        }, 'Name'),
                        jsx('input', { 
                            type: 'text', 
                            id: 'name', 
                            name: 'name',
                            required: true,
                            className: 'w-full',
                            style: styles.inputStyle
                        })
                    ]),
                    jsx('div', { className: 'form-group' }, [
                        jsx('label', { 
                            htmlFor: 'company', 
                            className: 'block text-sm font-medium mb-1',
                            style: styles.textMuted
                        }, 'Company'),
                        jsx('input', { 
                            type: 'text', 
                            id: 'company', 
                            name: 'company',
                            className: 'w-full',
                            style: styles.inputStyle
                        })
                    ]),
                    jsx('div', { className: 'form-group' }, [
                        jsx('label', { 
                            htmlFor: 'email', 
                            className: 'block text-sm font-medium mb-1',
                            style: styles.textMuted
                        }, 'Email'),
                        jsx('input', { 
                            type: 'email', 
                            id: 'email', 
                            name: 'email',
                            required: true,
                            className: 'w-full',
                            style: styles.inputStyle
                        })
                    ]),
                    jsx('div', { className: 'form-group' }, [
                        jsx('label', { 
                            htmlFor: 'phone', 
                            className: 'block text-sm font-medium mb-1',
                            style: styles.textMuted
                        }, 'Phone'),
                        jsx('input', { 
                            type: 'tel', 
                            id: 'phone', 
                            name: 'phone',
                            className: 'w-full',
                            style: styles.inputStyle
                        })
                    ]),
                    jsx('div', { className: 'form-group' }, [
                        jsx('label', { 
                            htmlFor: 'message', 
                            className: 'block text-sm font-medium mb-1',
                            style: styles.textMuted
                        }, 'Message'),
                        jsx('textarea', { 
                            id: 'message', 
                            name: 'message',
                            rows: 5,
                            required: true,
                            className: 'w-full',
                            style: styles.inputStyle
                        })
                    ]),
                    jsx('button', { 
                        type: 'submit',
                        className: 'font-semibold px-6 py-3 rounded-md shadow-md w-full',
                        style: styles.buttonPrimary
                    }, 'Send Message')
                ])
            ]),
            // Direct Contact Info Card
            jsx('div', { 
                className: 'p-8 rounded-lg shadow-lg',
                style: styles.card 
            }, [
                jsx('h2', { 
                    className: 'text-3xl font-bold mb-6',
                    style: styles.textPrimary
                }, content.directHeading || 'Direct Contact'),
                jsx('div', { className: 'space-y-4' }, 
                    (content.contactInfo || []).map((info, index) => 
                        jsx('div', { 
                            key: index,
                            className: 'mb-4'
                        }, [
                            jsx('strong', { 
                                className: 'block text-lg',
                                style: styles.textPrimary 
                            }, info.type || ''),
                            jsx('p', { style: styles.textMuted }, info.value || '')
                        ])
                    )
                ),
                jsx('div', { className: 'mt-6' }, [
                    jsx('strong', { 
                        className: 'block text-lg',
                        style: styles.textPrimary 
                    }, content.locationLabel || 'Our Location'),
                    jsx('p', { style: styles.textMuted }, content.address1 || ''),
                    content.address2 ? jsx('p', { style: styles.textMuted }, content.address2) : null,
                    content.address3 ? jsx('p', { style: styles.textMuted }, content.address3) : null
                ])
            ])
        ])
    ]);
};

// Demo Section
const DemoSection = ({ onNavigate }) => {
    const content = getDemoContent().getOrElse({});
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
            }, content.heading || 'Schedule a Demo'),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-6',
                style: styles.textMuted
            }, content.description || ''),
            jsx('div', { 
                className: 'p-4 rounded-md my-6 text-center',
                style: styles.innerCard
            }, [
                jsx('span', {style: styles.textMuted}, '📅 Calendar Scheduling Widget Placeholder')
            ]),
            jsx('button', {
                onClick: safeButtonClick(() => alert('Demo scheduling feature coming soon!')),
                className: 'font-semibold px-8 py-3 rounded-md shadow-md',
                style: styles.buttonPrimary
            }, 'Schedule Demo')
        ])
    ]);
};

// Project Consultation Section
const ProjectConsultationSection = () => {
    const content = getProjectConsultationContent().getOrElse({});
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
            }, content.heading || 'Project Consultation'),
            jsx('p', { 
                className: 'text-lg leading-relaxed',
                style: styles.textMuted
            }, content.description || 'Have a specific project in mind? Let us know how we can help.')
        ])
    ]);
};

// FAQ Preview Section
const FAQPreviewSection = ({ onNavigate }) => {
    const content = getFAQPreviewContent().getOrElse({});
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
            }, content.heading || 'Frequently Asked Questions'),
            jsx('ul', { 
                className: 'space-y-4 mb-8'
            }, (content.questions || []).map((question, index) => 
                jsx('li', { 
                    key: index, 
                    className: 'p-4 rounded-md',
                    style: styles.innerCard
                }, [
                    jsx('span', {style: styles.textPrimary}, question)
                ])
            )),
            jsx('div', {className: 'text-center'}, [
                jsx('button', {
                    onClick: safeButtonClick(() => onNavigate('faqs')),
                    className: 'font-semibold px-8 py-3 rounded-md shadow-md',
                    style: styles.buttonPrimary
                }, 'View All FAQs')
            ])
        ])
    ]);
};

// Locations Section
const LocationsSection = () => {
    const content = getLocationsContent().getOrElse({});
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
            }, content.heading || 'Our Locations'),
            jsx('div', { className: 'grid md:grid-cols-2 gap-6 text-left' }, [
                jsx('div', {}, [
                    jsx('h3', { 
                        className: 'text-xl font-semibold mb-2',
                        style: styles.textPrimary
                    }, 'Headquarters'),
                    jsx('p', { style: styles.textMuted }, content.headquarters || 'Colorado')
                ]),
                jsx('div', {}, [
                    jsx('h3', { 
                        className: 'text-xl font-semibold mb-2',
                        style: styles.textPrimary
                    }, 'Regional Offices'),
                    jsx('p', { style: styles.textMuted }, content.regionalOffices || 'New York, London, Singapore')
                ])
            ])
        ])
    ]);
};

// Main Contact Page Component
const ContactPage = ({ onNavigate }) => {
    return jsx('div', { className: 'pt-16 main-content contact-page' }, [
        PageTitleSection(),
        ContactOptionsSection(),
        DemoSection({ onNavigate }),
        ProjectConsultationSection(),
        FAQPreviewSection({ onNavigate }),
        LocationsSection()
    ]);
};

export default ContactPage; 