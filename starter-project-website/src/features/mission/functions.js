import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Our Mission"
    });
};

// Mission statement content
export const getMissionStatementContent = () => {
    return Maybe.Just({
        heading: "Our Mission",
        statement: "To provide enterprises with the tools, infrastructure, and expertise needed to successfully implement and scale decentralized solutions that deliver measurable business value.",
        tagline: "We Build Builders - Empowering fin-tech innovators with cutting-edge reusable, shareable, and expandable Decentralized Ecosystems."
    });
};

// Vision and values content
export const getVisionValuesContent = () => {
    return Maybe.Just({
        visionHeading: "Our Vision",
        visionStatement: "To build the foundation for a more equitable, efficient, and open digital economy by enabling enterprises to harness the power of decentralized technologies.",
        valuesHeading: "Our Values",
        values: [
            {
                name: "Innovation",
                description: "We constantly push boundaries while maintaining enterprise-grade reliability."
            },
            {
                name: "Security",
                description: "We make no compromises when it comes to protecting our clients data and systems."
            },
            {
                name: "Transparency",
                description: "We believe in open communication and visibility in all our operations."
            },
            {
                name: "Collaboration",
                description: "We work closely with our clients as true partners in their digital journey."
            }
        ]
    });
};

// Impact goals content
export const getImpactGoalsContent = () => {
    return Maybe.Just({
        heading: "Our Impact Goals",
        introduction: "By 2030, we aim to:",
        goals: [
            "Enable 1000+ enterprises to successfully implement decentralized solutions",
            "Reduce enterprise infrastructure costs by $1B through decentralized architectures",
            "Eliminate 100M+ tons of carbon emissions through more efficient digital infrastructure",
            "Create an ecosystem supporting 10,000+ developers building enterprise Web3 solutions",
            "Establish new standards for transparent, ethical business operations through decentralized governance"
        ]
    });
};

// Leadership message content
export const getLeadershipMessageContent = () => {
    return Maybe.Just({
        heading: "From Our Founder",
        quote: "Our mission at CryptoVersus goes beyond technology - were creating a new paradigm for how enterprises operate in the digital economy. By providing reliable, secure infrastructure for decentralized applications, were empowering businesses to innovate while maintaining the standards their stakeholders expect. Our journey began with the vision of bringing the benefits of Web3 to the enterprise world in a way that addresses their unique needs for security, scalability, and compliance. Today, were proud to be building the foundation that allows companies to transform their operations and create new value for their customers.",
        attribution: "Dr. Robert Whetsel, Founder CEO"
    });
};

// Join us content
export const getJoinUsContent = () => {
    return Maybe.Just({
        heading: "Join Our Mission",
        description: "Become part of the enterprise decentralization movement and transform your organizations digital future. Whether youre a developer, enterprise customer, or potential partner, theres a place for you in our ecosystem as we build the next generation of digital infrastructure.",
        buttons: [
            {
                text: "Get Started",
                action: "contact"
            },
            {
                text: "View Services",
                action: "services"
            },
            {
                text: "Learn More",
                action: "about"
            }
        ]
    });
}; 