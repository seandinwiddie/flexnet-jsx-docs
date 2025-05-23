import { jsx } from '../../core/runtime/jsx.js';
import { 
    getPageTitleContent,
    getCompanyOverviewContent,
    getVisionMissionContent,
    getLeadershipTeamContent,
    getApproachContent,
    getInnovationsContent,
    getPartnersContent,
    getCTAContent
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
    innerCard: { // For cards within cards, like list items or team members
        backgroundColor: 'hsl(240 3.7% 15.9%)', // --accent or a slightly darker card variant
        borderColor: 'hsl(240 3.7% 20%)', // A slightly different border for inner cards
        borderWidth: '1px',
        borderStyle: 'solid'
    },
    buttonPrimary: {
        backgroundColor: '#667eea', // Keeping brand purple --cv-primary-500
        color: 'hsl(0 0% 98%)', // --primary-foreground (ensure high contrast)
    },
    // No secondary button explicitly defined here, but can be added if needed
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
            }, content.title || 'Lorem Ipsum'),
            jsx('p', { 
                className: 'text-xl md:text-2xl',
                style: styles.textMuted
            }, content.subtitle || 'Learn more about our company, mission, and team.')
        ])
    ]);
};

// Company Overview Section
const CompanyOverviewSection = () => {
    const content = getCompanyOverviewContent().getOrElse({});
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
            }, content.heading || 'Our Story'),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-4',
                style: styles.textMuted
            }, content.paragraph1 || ''),
            jsx('p', { 
                className: 'text-lg leading-relaxed',
                style: styles.textMuted
            }, content.paragraph2 || '')
        ])
    ]);
};

// Vision and Mission Section
const VisionMissionSection = () => {
    const content = getVisionMissionContent().getOrElse({});
    return jsx('section', { 
        className: 'py-12 md:py-20'
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl p-8 rounded-lg shadow-lg text-center',
            style: styles.card
        }, [
            jsx('div', { className: 'mb-8' }, [
                jsx('h2', { 
                    className: 'text-3xl sm:text-4xl font-bold mb-4',
                    style: styles.textPrimary
                }, content.visionHeading || 'Our Vision'),
                jsx('p', { 
                    className: 'text-lg leading-relaxed',
                    style: styles.textMuted
                }, content.visionStatement || '')
            ]),
            jsx('div', {}, [
                jsx('h2', { 
                    className: 'text-3xl sm:text-4xl font-bold mb-4',
                    style: styles.textPrimary
                }, content.missionHeading || 'Our Mission'),
                jsx('p', { 
                    className: 'text-lg leading-relaxed',
                    style: styles.textMuted
                }, content.missionStatement || '')
            ])
        ])
    ]);
};

// Leadership Team Section
const LeadershipTeamSection = () => {
    const content = getLeadershipTeamContent().getOrElse({});
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
            }, content.heading || 'Meet Our Team'),
            jsx('div', { 
                className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
            }, (content.members || []).map((member, index) => 
                jsx('div', { 
                    key: index,
                    className: 'p-6 rounded-lg shadow-md text-center',
                    style: styles.innerCard
                }, [
                    jsx('div', {
                        className: 'w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-semibold',
                        style: { backgroundColor: 'hsl(240 4.8% 9.5%)', color: 'hsl(0 0% 98%)' }
                    }, member.name ? member.name.substring(0,1) : 'U'), 
                    jsx('h3', { 
                        className: 'text-xl font-semibold mb-1',
                        style: styles.textPrimary
                    }, member.name || ''),
                    jsx('p', { 
                        className: 'text-sm mb-2',
                        style: styles.textMuted
                    }, member.title || ''),
                    jsx('p', { 
                        className: 'text-sm',
                        style: styles.textMuted
                    }, member.bio || '')
                ])
            ))
        ])
    ]);
};

// Approach Section
const ApproachSection = () => {
    const content = getApproachContent().getOrElse({});
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
            }, content.heading || 'Our Approach'),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-8 text-center',
                style: styles.textMuted
            }, content.description || ''),
            jsx('ul', { 
                className: 'space-y-4'
            }, (content.priorities || []).map((priority, index) => 
                jsx('li', { 
                    key: index, 
                    className: 'flex items-start p-4 rounded-lg shadow-md',
                    style: { ...styles.innerCard, padding: '1rem' }
                }, [
                    jsx('span', { 
                        className: 'flex-shrink-0 mr-3 font-bold text-xl',
                        style: { color: '#667eea' }
                    }, ''),
                    jsx('span', { 
                        style: styles.textPrimary 
                    }, priority)
                ])
            ))
        ])
    ]);
};

// Innovations Section
const InnovationsSection = () => {
    const content = getInnovationsContent().getOrElse({});
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
            }, content.heading || 'Fueling Innovation'),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-8 text-center',
                style: styles.textMuted
            }, content.description || ''),
            jsx('ul', { 
                className: 'space-y-4'
            }, (content.innovations || []).map((innovation, index) => 
                jsx('li', { 
                    key: index, 
                    className: 'flex flex-col p-4 rounded-lg shadow-md',
                    style: { ...styles.innerCard, padding: '1rem' }
                }, [
                    jsx('strong', {
                        className: 'font-semibold mb-1',
                        style: styles.textPrimary
                    }, innovation.name || ''),
                    jsx('span', { 
                        style: styles.textMuted
                    }, innovation.description || '')
                ])
            ))
        ])
    ]);
};

// Partners Section
const PartnersSection = () => {
    const content = getPartnersContent().getOrElse({});
    return jsx('section', { 
        className: 'py-12 md:py-20' 
    }, [
        jsx('div', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 p-8 rounded-lg shadow-lg',
            style: styles.card 
        }, [
            jsx('h2', { 
                className: 'text-3xl sm:text-4xl font-bold mb-6 text-center',
                style: styles.textPrimary
            }, content.heading || 'Our Partners & Ecosystem'),
            jsx('div', { 
                className: 'text-center'
            }, [
                jsx('p', {
                    className: 'text-lg italic',
                    style: styles.textMuted
                }, content.description || '')
            ])
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
            }, content.heading || 'Lorem Ipsum Dolor?'),
            jsx('p', { 
                className: 'text-lg md:text-xl max-w-2xl mx-auto mb-8',
                style: styles.textMuted
            }, content.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
            jsx('button', {
                onClick: safeButtonClick(() => onNavigate('contact')),
                className: 'font-semibold px-8 py-4 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105 text-lg',
                style: styles.buttonPrimary 
            }, 'Lorem Ipsum')
        ])
    ]);
};

// Main About Page Component
const AboutPage = ({ onNavigate }) => {
    return jsx('div', { className: 'pt-16 main-content about-page' }, [
        PageTitleSection(),
        CompanyOverviewSection(),
        VisionMissionSection(),
        LeadershipTeamSection(),
        ApproachSection(),
        InnovationsSection(),
        PartnersSection(),
        CTASection({ onNavigate })
    ]);
};

export default AboutPage; 