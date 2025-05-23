import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "About Us",
        subtitle: "Leaders in Enterprise Decentralized Infrastructure"
    });
};

// Company overview content
export const getCompanyOverviewContent = () => {
    return Maybe.Just({
        paragraph1: "Founded by Dr. Robert Whetsel, CryptoVersus (a division of ACMEWERX, a Colorado S-Corp) has been at the forefront of bringing decentralized technologies to the enterprise market. Our team combines decades of experience in enterprise IT, cloud infrastructure, and distributed systems.",
        paragraph2: "We've built a platform that bridges the gap between cutting-edge Web3 technologies and the reliability, security, and compliance demands of modern enterprises. Our core technology design is based on our patent for \"Trusted client-centric application architecture\" and dissertation work on measuring big data variety using Kolmogorov's Complexity."
    });
};

// Vision and mission content
export const getVisionMissionContent = () => {
    return Maybe.Just({
        visionHeading: "Our Vision",
        visionStatement: "To build the foundation for a more equitable, efficient, and open digital economy by enabling enterprises to harness the power of decentralized technologies.",
        missionHeading: "Our Mission",
        missionStatement: "To provide enterprises with the tools, infrastructure, and expertise needed to successfully implement and scale decentralized solutions that deliver measurable business value."
    });
};

// Leadership team content
export const getLeadershipTeamContent = () => {
    return Maybe.Just({
        heading: "Leadership Team",
        members: [
            {
                name: "Dr. Robert Whetsel",
                title: "Founder & CEO",
                photo: "👨‍💼",
                bio: "With a background in computer science and extensive experience in enterprise architecture, Dr. Whetsel's vision drives our innovation in decentralized technology."
            }
            // Additional team members to be added
        ]
    });
};

// Approach content
export const getApproachContent = () => {
    return Maybe.Just({
        heading: "Enterprise-First Methodology",
        description: "Unlike many projects in the Web3 space, we approach decentralization from an enterprise perspective. This means we prioritize:",
        priorities: [
            'Security and risk management',
            'Scalability and performance',
            'Compliance and governance',
            'Integration with existing systems',
            'Measurable business outcomes',
            'Building in public with transparency'
        ]
    });
};

// Innovations content
export const getInnovationsContent = () => {
    return Maybe.Just({
        heading: "Our Innovations",
        description: "We're constantly pushing the boundaries of what's possible with decentralized technology:",
        innovations: [
            {
                name: "Web3/WEB3 Protocols",
                description: "Advanced decentralized network protocols"
            },
            {
                name: "DeFi Security Protocols",
                description: "Enterprise-grade security for financial applications"
            },
            {
                name: "Social Crypto Syndication Protocols",
                description: "Enabling community-driven ecosystems"
            },
            {
                name: "INDECO (KYC) Protocols",
                description: "Compliant identity verification"
            },
            {
                name: "VS. Protocols",
                description: "Zero-trust role-based access control"
            }
        ]
    });
};

// Partners content
export const getPartnersContent = () => {
    return Maybe.Just({
        heading: "Trusted By Industry Leaders",
        partners: [
            // To be filled with partner logos
            "Partner Logo",
            "Partner Logo",
            "Partner Logo"
        ]
    });
};

// CTA content
export const getCTAContent = () => {
    return Maybe.Just({
        heading: "Join Our Journey",
        description: "Become part of the enterprise decentralization movement and transform your organization's digital infrastructure."
    });
}; 