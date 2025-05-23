// Homepage content and utility functions
import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';

// Hero section content
const getHeroContent = () => {
    console.log(`[Homepage Functions] Loading hero content`);
    const content = {
        siteName: 'Lorem Ipsum',
        tagline: 'Lorem Ipsum Dolor Sit',
        headline: 'Lorem Ipsum Dolor Sit Amet Consectetur',
        subheadline: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    };
    console.log(`[Homepage Functions] Hero content loaded successfully`);
    return Maybe.Just(content);
};

// Digital transformation section content
const getDigitalTransformationContent = () => Maybe.Just({
    heading: 'Lorem Ipsum Dolor Sit Amet',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
});

// Web3 explanation content
const getWeb3Content = () => Maybe.Just({
    heading: 'Lorem Ipsum Dolor Sit Amet?',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua:',
    benefits: [
        'Lorem ipsum dolor sit amet consectetur',
        'Sed do eiusmod tempor incididunt ut labore', 
        'Ut enim ad minim veniam quis nostrud',
        'Duis aute irure dolor in reprehenderit',
        'Excepteur sint occaecat cupidatat non proident'
    ]
});

// Core services content
const getCoreServicesContent = () => Maybe.Just({
    heading: 'Lorem Ipsum:',
    services: [
        {
            id: 'compute',
            title: 'Lorem Ipsum Dolor Sit',
            icon: '⚡',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit'
        },
        {
            id: 'storage', 
            title: 'Lorem Ipsum Dolor Sit',
            icon: '🗄️',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore'
        },
        {
            id: 'networks',
            title: 'Lorem Ipsum Dolor Sit Amet',
            icon: '🌐',
            description: 'Ut enim ad minim veniam quis nostrud exercitation'
        },
        {
            id: 'contracts',
            title: 'Lorem Ipsum Dolor',
            icon: '📜',
            description: 'Duis aute irure dolor in reprehenderit voluptate'
        },
        {
            id: 'identity',
            title: 'Lorem Ipsum Dolor Sit Amet',
            icon: '🔐',
            description: 'Excepteur sint occaecat cupidatat non proident'
        },
        {
            id: 'tokenization',
            title: 'Lorem Ipsum Dolor',
            icon: '🪙',
            description: 'Sunt in culpa qui officia deserunt mollit anim'
        },
        {
            id: 'analytics',
            title: 'Lorem Ipsum Dolor Sit',
            icon: '🤖',
            description: 'At vero eos et accusamus et iusto odio dignissimos'
        }
    ]
});

// Why CryptoVersus content
const getWhyCryptoVersusContent = () => Maybe.Just({
    heading: 'Lorem Ipsum Dolor?',
    benefits: [
        {
            title: 'Lorem Ipsum',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod'
        },
        {
            title: 'Lorem Ipsum Dolor', 
            description: 'Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim'
        },
        {
            title: 'Lorem Ipsum',
            description: 'Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea'
        },
        {
            title: 'Lorem Ipsum Dolor',
            description: 'Commodo consequat duis aute irure dolor in reprehenderit voluptate'
        },
        {
            title: 'Lorem Ipsum Dolor',
            description: 'Velit esse cillum dolore eu fugiat nulla pariatur excepteur sint'
        },
        {
            title: 'Lorem Ipsum Dolor',
            description: 'Occaecat cupidatat non proident sunt in culpa qui officia deserunt'
        }
    ]
});

// CTA content
const getCTAContent = () => Maybe.Just({
    heading: 'Lorem Ipsum Dolor Sit Amet Consectetur',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    buttons: [
        { text: 'Lorem Ipsum', action: 'contact', type: 'primary' },
        { text: 'Lorem Ipsum', action: 'services', type: 'secondary' },
        { text: 'Lorem Ipsum', action: 'about', type: 'secondary' }
    ]
});

// Handle CTA button clicks
const handleCTAClick = (action, onNavigate) => {
    console.log(`[Homepage Functions] CTA button clicked with action: ${action}`);
    return Result.fromTry(() => {
        switch(action) {
            case 'contact':
                console.log(`[Homepage Functions] Navigating to contact page`);
                return onNavigate('contact');
            case 'services':
                console.log(`[Homepage Functions] Navigating to services page`);
                return onNavigate('services');
            case 'about':
                console.log(`[Homepage Functions] Navigating to about page`);
                return onNavigate('about');
            default:
                console.error(`[Homepage Functions] Unknown CTA action: ${action}`);
                throw new Error(`Unknown action: ${action}`);
        }
    });
};

export {
    getHeroContent,
    getDigitalTransformationContent,
    getWeb3Content,
    getCoreServicesContent,
    getWhyCryptoVersusContent,
    getCTAContent,
    handleCTAClick
}; 