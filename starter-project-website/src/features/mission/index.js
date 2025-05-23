import { jsx } from '../../core/runtime/jsx.js';
import { 
    getPageTitleContent,
    getMissionStatementContent,
    getVisionValuesContent,
    getImpactGoalsContent,
    getLeadershipMessageContent,
    getJoinUsContent
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
    innerCard: { // For cards within cards, like values or goals
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
                className: 'text-4xl sm:text-5xl md:text-6xl font-bold',
                style: styles.textPrimary
            }, content.title || 'Our Mission')
        ])
    ]);
};

// Mission Statement Section
const MissionStatementSection = () => {
    const content = getMissionStatementContent().getOrElse({});
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
            }, content.heading || 'Statement of Purpose'),
            jsx('p', { 
                className: 'text-xl md:text-2xl leading-relaxed italic mb-4',
                style: styles.textPrimary // Mission statement itself can be primary text
            }, content.statement || ''),
            content.tagline ? jsx('p', { 
                className: 'text-lg',
                style: styles.textMuted
            }, content.tagline) : null
        ])
    ]);
};

// Vision and Values Section
const VisionValuesSection = () => {
    const content = getVisionValuesContent().getOrElse({});
    return jsx('section', { 
        className: 'py-12 md:py-20' 
    }, [
        jsx('div', {
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 p-8 rounded-lg shadow-lg',
            style: styles.card 
        }, [
            jsx('div', { className: 'mb-12 text-center' }, [
                jsx('h2', { 
                    className: 'text-3xl sm:text-4xl font-bold mb-4',
                    style: styles.textPrimary
                }, content.visionHeading || 'Our Vision'),
                jsx('p', { 
                    className: 'text-lg leading-relaxed max-w-2xl mx-auto',
                    style: styles.textMuted
                }, content.visionStatement || '')
            ]),
            jsx('div', { className: 'text-center' }, [
                jsx('h2', { 
                    className: 'text-3xl sm:text-4xl font-bold mb-8',
                    style: styles.textPrimary
                }, content.valuesHeading || 'Our Core Values'),
                jsx('div', { 
                    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                },
                    (content.values || []).map((value, index) => 
                        jsx('div', {
                            key: index,
                            className: 'p-6 rounded-md text-left', // Values are inner cards, text-left for content
                            style: styles.innerCard 
                        }, [
                            jsx('h3', { 
                                className: 'text-xl font-semibold mb-2',
                                style: styles.textPrimary
                            }, value.name || ''),
                            jsx('p', { 
                                className: 'text-sm leading-relaxed',
                                style: styles.textMuted
                            }, value.description || '')
                        ])
                    )
                )
            ])
        ])
    ]);
};

// Impact Goals Section
const ImpactGoalsSection = () => {
    const content = getImpactGoalsContent().getOrElse({});
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
            }, content.heading || 'Our Impact Goals'),
            jsx('p', { 
                className: 'text-lg leading-relaxed mb-8 text-center',
                style: styles.textMuted
            }, content.introduction || ''),
            jsx('ul', { 
                className: 'space-y-4' 
            }, (content.goals || []).map((goal, index) => 
                jsx('li', { 
                    key: index, 
                    className: 'flex items-start p-4 rounded-md',
                    style: { ...styles.innerCard, padding: '1rem' }
                }, [
                    jsx('span', { 
                        className: 'flex-shrink-0 mr-3 font-bold text-xl',
                        style: { color: '#667eea' } // Brand purple for list marker
                    }, ''),
                    jsx('span', { 
                        style: styles.textPrimary 
                    }, goal)
                ])
            ))
        ])
    ]);
};

// Leadership Message Section
const LeadershipMessageSection = () => {
    const content = getLeadershipMessageContent().getOrElse({});
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
            }, content.heading || 'A Message From Our Leadership'),
            jsx('blockquote', { 
                className: 'text-lg italic leading-relaxed mb-6 p-4 rounded-md',
                style: { ...styles.innerCard, borderLeft: '4px solid #667eea' } // Quoted text style
            }, content.quote || ''),
            jsx('p', { 
                className: 'text-md font-semibold',
                style: styles.textPrimary
            }, content.attribution || '')
        ])
    ]);
};

// Join Us Section
const JoinUsSection = ({ onNavigate }) => {
    const content = getJoinUsContent().getOrElse({});
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
            }, content.heading || 'Become Part of Our Mission'),
            jsx('p', { 
                className: 'text-lg md:text-xl max-w-2xl mx-auto mb-8',
                style: styles.textMuted
            }, content.description || ''),
            jsx('div', { 
                className: 'flex flex-wrap justify-center gap-4' 
            }, 
                (content.buttons || []).map((button, index) => jsx('button', {
                    key: index,
                    onClick: safeButtonClick(() => onNavigate(button.action), `JoinUs-${button.action}`),
                    className: 'font-semibold px-8 py-3 rounded-md shadow-md transition-colors duration-150 ease-in-out transform hover:scale-105',
                    style: button.type === 'primary' || index === 0 ? styles.buttonPrimary : styles.buttonSecondary // Default first to primary
                }, button.text || 'Learn More'))
            )
        ])
    ]);
};

// Main Mission Page Component
const MissionPage = ({ onNavigate }) => {
    return jsx('div', { className: 'pt-16 main-content mission-page' }, [
        PageTitleSection(),
        MissionStatementSection(),
        VisionValuesSection(),
        ImpactGoalsSection(),
        LeadershipMessageSection(),
        JoinUsSection({ onNavigate })
    ]);
};

export default MissionPage; 