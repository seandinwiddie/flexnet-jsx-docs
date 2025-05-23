import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Enterprise Web3 Services",
        subtitle: "Comprehensive Decentralized Infrastructure for Modern Enterprises"
    });
};

// Services content
export const getServicesContent = () => {
    return Maybe.Just({
        services: [
            {
                id: 'compute',
                title: 'Decentralized Compute',
                icon: '⚡',
                description: 'Deploy applications with enterprise-grade reliability and performance across our distributed consensus network.',
                features: [
                    'High availability architecture',
                    'Scalable compute resources',
                    'Secure execution environment',
                    'Developer-friendly interfaces',
                    'AI-powered resource optimization'
                ]
            },
            {
                id: 'storage',
                title: 'Web3 Storage Solutions',
                icon: '💾',
                description: 'Secure, redundant, and censorship-resistant data storage with enterprise SLAs and compliance features.',
                features: [
                    'Distributed data architecture',
                    'Immutable audit trails',
                    'Automated data verification',
                    'Regulatory compliance features',
                    'IPFS and Filecoin integration'
                ]
            },
            {
                id: 'networks',
                title: 'Enterprise Decentralized Networks',
                icon: '🌐',
                description: 'Custom private and consortium deployments with governance frameworks tailored to your industry requirements.',
                features: [
                    'Custom network architecture',
                    'Permissioned access controls',
                    'Governance frameworks',
                    'Cross-chain interoperability',
                    'Zero-trust security model'
                ]
            },
            {
                id: 'contracts',
                title: 'Smart Contract Platform',
                icon: '📋',
                description: 'Deploy, manage, and monitor smart contracts with advanced security features and audit capabilities.',
                features: [
                    'Contract templates library',
                    'Automated security auditing',
                    'Version control and deployment',
                    'Monitoring and analytics',
                    'AI-assisted vulnerability detection'
                ]
            },
            {
                id: 'identity',
                title: 'Identity & Access Management',
                icon: '🔐',
                description: 'Enterprise-grade decentralized identity solutions with seamless integration to existing systems.',
                features: [
                    'VS. protocols - zero-trust R/A-BAC',
                    'INDECO protocols - KYC integration',
                    'Self-sovereign identity options',
                    'Legacy system integration',
                    'Compliance with privacy regulations'
                ]
            },
            {
                id: 'tokenization',
                title: 'Tokenization Framework',
                icon: '🪙',
                description: 'Create, deploy, and manage digital assets with built-in compliance and regulatory considerations.',
                features: [
                    'Asset tokenization tools',
                    'Regulatory compliance checks',
                    'Lifecycle management',
                    'Exchange and liquidity options',
                    'Built-in tokenized economy support'
                ]
            }
        ]
    });
};

// AI Integration content
export const getAIIntegrationContent = () => {
    return Maybe.Just({
        heading: "AI-Enhanced Web3 Services",
        description: "Our platform leverages advanced AI to enhance security, performance, and usability:",
        benefits: [
            'Intelligent security monitoring',
            'Predictive analytics for resource optimization',
            'Smart contract analysis and validation',
            'Natural language interfaces for Web3 accessibility',
            'Data governance and compliance automation'
        ]
    });
};

// Pricing packages content
export const getPricingPackagesContent = () => {
    return Maybe.Just({
        heading: "Enterprise Service Packages",
        packages: [
            {
                name: "Starter Package",
                features: [
                    'Core services',
                    'Basic support',
                    'Standard SLA',
                    'Development environment access'
                ]
            },
            {
                name: "Growth Package",
                featured: true,
                features: [
                    'Advanced services',
                    'Priority support',
                    'Enhanced SLA',
                    'Production deployment assistance'
                ]
            },
            {
                name: "Enterprise Package",
                features: [
                    'All services',
                    '24/7 support',
                    'Custom SLA',
                    'Dedicated solution architect'
                ]
            }
        ]
    });
};

// Consultation CTA content
export const getConsultationCTAContent = () => {
    return Maybe.Just({
        heading: "Schedule a Service Consultation",
        description: "Discuss your specific requirements with our solution architects to design the optimal service package for your enterprise."
    });
}; 