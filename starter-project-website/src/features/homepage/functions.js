// Homepage content and utility functions
import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';

// Hero section content
const getHeroContent = () => {
    console.log(`[Homepage Functions] Loading hero content`);
    const content = {
        siteName: 'CryptoVersus.io',
        tagline: 'Enterprise Decentralized Infrastructure',
        headline: 'The Enterprise-Grade Decentralized Platform',
        subheadline: 'Bridging Enterprises to the Future of Digital Infrastructure',
        description: 'CryptoVersus delivers a comprehensive suite of Web3 protocols and infrastructure services that enable enterprises to harness emerging technology with the reliability, security, and scalability that businesses demand.'
    };
    console.log(`[Homepage Functions] Hero content loaded successfully`);
    return Maybe.Just(content);
};

// Digital transformation section content
const getDigitalTransformationContent = () => Maybe.Just({
    heading: 'Your Digital Transformation Partner',
    content: 'Think of us as AWS for the decentralized web - providing the building blocks, tools, and managed services that allow your organization to innovate without the complexity of building and maintaining underlying decentralized infrastructure.'
});

// Web3 explanation content
const getWeb3Content = () => Maybe.Just({
    heading: 'What is Web3 for Enterprises?',
    description: 'Web3 represents the next evolution of internet services built on decentralized technologies. For enterprises, this means:',
    benefits: [
        'GREATER CONTROL over digital assets and data',
        'ENHANCED SECURITY through distributed systems', 
        'NEW REVENUE STREAMS via tokenization and digital economies',
        'IMPROVED TRANSPARENCY in business operations',
        'REDUCED COSTS by eliminating intermediaries'
    ]
});

// Core services content
const getCoreServicesContent = () => Maybe.Just({
    heading: 'Core Services:',
    services: [
        {
            id: 'compute',
            title: 'Decentralized Compute Networks',
            icon: '⚡',
            description: 'High-performance distributed computing infrastructure'
        },
        {
            id: 'storage', 
            title: 'Web3 Storage Solutions',
            icon: '🗄️',
            description: 'Secure, redundant, and censorship-resistant data storage'
        },
        {
            id: 'networks',
            title: 'Enterprise Decentralized Networks',
            icon: '🌐',
            description: 'Custom private and consortium network deployments'
        },
        {
            id: 'contracts',
            title: 'Smart Contract Platform',
            icon: '📜',
            description: 'Deploy and manage smart contracts with advanced security'
        },
        {
            id: 'identity',
            title: 'Zero-Trust Identity & Access Management',
            icon: '🔐',
            description: 'Enterprise-grade decentralized identity solutions'
        },
        {
            id: 'tokenization',
            title: 'Tokenization Framework',
            icon: '🪙',
            description: 'Create and manage digital assets with built-in compliance'
        },
        {
            id: 'analytics',
            title: 'AI-Enhanced Analytics & Security',
            icon: '🤖',
            description: 'Intelligent monitoring and predictive analytics'
        }
    ]
});

// Why CryptoVersus content
const getWhyCryptoVersusContent = () => Maybe.Just({
    heading: 'Why CryptoVersus?',
    benefits: [
        {
            title: 'Enterprise-Ready',
            description: 'Built from the ground up for business requirements with robust SLAs and support'
        },
        {
            title: 'Patent-Based Technology', 
            description: 'Founded on our "Trusted client-centric application architecture" patent'
        },
        {
            title: 'Interoperability',
            description: 'Seamless integration with existing systems and multiple decentralized protocols'
        },
        {
            title: 'Compliance Focus',
            description: 'Advanced tools for regulatory adherence across jurisdictions'
        },
        {
            title: 'Operational Simplicity',
            description: 'Managed services that abstract complexity while maintaining decentralized benefits'
        },
        {
            title: 'Scalable Architecture',
            description: 'Flexible infrastructure that grows with your initiatives'
        }
    ]
});

// CTA content
const getCTAContent = () => Maybe.Just({
    heading: 'Start Your Enterprise Digital Transformation',
    description: 'Connect with our solutions team to discuss how CryptoVersus can accelerate your organization\'s adoption of decentralized technologies.',
    buttons: [
        { text: 'Schedule Consultation', action: 'contact', type: 'primary' },
        { text: 'View Services', action: 'services', type: 'secondary' },
        { text: 'Learn More', action: 'about', type: 'secondary' }
    ]
});

// Key Priorities content
const getKeyPrioritiesContent = () => Maybe.Just({
    heading: 'Our Key Priorities',
    priorities: [
        'Enterprise-Grade Security & Compliance',
        'Seamless Integration & Interoperability',
        'Scalable & Future-Proof Architectures',
        'Actionable Insights through Advanced Analytics',
        'Empowering Developer Productivity'
    ]
});

// Team content
const getTeamContent = () => Maybe.Just({
    heading: 'Meet Our Leadership',
    members: [
        { name: 'Alex Chen', title: 'CEO & Chief Architect' },
        { name: 'Brenda Li', title: 'CTO & Head of Engineering' },
        { name: 'Carlos Gomez', title: 'VP of Product & Strategy' },
        { name: 'Diana Wells', title: 'Head of Security & Compliance' },
        { name: 'Ethan Hunt', title: 'Lead, Decentralized Solutions' },
        { name: 'Fiona Glenanne', title: 'Principal Blockchain Researcher' }
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
    handleCTAClick,
    getKeyPrioritiesContent,
    getTeamContent
}; 