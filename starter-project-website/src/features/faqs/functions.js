import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Frequently Asked Questions",
        subtitle: "Answers to common questions about our enterprise Web3 solutions"
    });
};

// Search and categories content
export const getSearchCategoriesContent = () => {
    return Maybe.Just({
        categories: [
            "General",
            "Technology",
            "Implementation",
            "Security",
            "Pricing"
        ]
    });
};

// FAQ categories content
export const getFAQCategoriesContent = () => {
    return Maybe.Just({
        categories: [
            {
                name: "General Questions",
                questions: [
                    {
                        question: "What is CryptoVersus.io?",
                        answer: "CryptoVersus is a division of ACMEWERX that provides enterprise-grade decentralized infrastructure, similar to how AWS operates for traditional cloud computing."
                    },
                    {
                        question: "How does CryptoVersus differ from other Web3 platforms?",
                        answer: "Our platform is built on patented technology specifically designed for enterprise requirements, focusing on security, compliance, and integration with existing systems."
                    },
                    {
                        question: "What types of enterprises use your platform?",
                        answer: "We serve organizations across finance, healthcare, supply chain, government, and creative industries looking to leverage decentralized technologies."
                    }
                ]
            },
            {
                name: "Technology",
                questions: [
                    {
                        question: "What is Web3 and why should enterprises care?",
                        answer: "Web3 represents the next evolution of internet services built on decentralized technologies, offering greater control, security, and new revenue opportunities for enterprises."
                    },
                    {
                        question: "How does your consensus network operate?",
                        answer: "Our platform utilizes multiple consensus mechanisms optimized for enterprise needs, balancing security, performance, and energy efficiency."
                    },
                    {
                        question: "What technologies underpin your platform?",
                        answer: "Our platform is built on our patent for 'Trusted client-centric application architecture' and incorporates advanced protocols for security, identity, and interoperability."
                    },
                    {
                        question: "Do you support multiple decentralized protocols?",
                        answer: "Yes, we support a wide range of protocols and can integrate with existing blockchain networks and Web3 standards."
                    }
                ]
            },
            {
                name: "Implementation",
                questions: [
                    {
                        question: "How long does implementation typically take?",
                        answer: "Implementation timelines vary based on complexity, but typically range from 4-12 weeks for initial deployment."
                    },
                    {
                        question: "What resources are required from our team?",
                        answer: "We work with your existing IT staff and provide training to ensure a smooth transition, minimizing additional resource requirements."
                    },
                    {
                        question: "How do you handle integration with legacy systems?",
                        answer: "Our platform includes purpose-built connectors and APIs designed to seamlessly integrate with existing enterprise systems."
                    },
                    {
                        question: "What training do you provide for our team?",
                        answer: "We offer comprehensive training programs including documentation, workshops, and ongoing support to ensure your team can effectively manage the platform."
                    }
                ]
            },
            {
                name: "Security and Compliance",
                questions: [
                    {
                        question: "How do you ensure platform security?",
                        answer: "Our zero-trust security model, built on VS. protocols, ensures comprehensive protection at all levels of the stack."
                    },
                    {
                        question: "What compliance standards do you meet?",
                        answer: "Our platform is designed to support compliance with GDPR, HIPAA, SOC 2, and industry-specific regulations."
                    },
                    {
                        question: "How do you handle data privacy requirements?",
                        answer: "We implement privacy-by-design principles and provide tools for managing data consent and sovereignty."
                    },
                    {
                        question: "What disaster recovery options are available?",
                        answer: "Our distributed architecture provides inherent resilience, and we offer additional backup and recovery solutions tailored to your requirements."
                    }
                ]
            }
        ]
    });
};

// Contact content
export const getContactContent = () => {
    return Maybe.Just({
        heading: "Still Have Questions?",
        description: "Our solution architects are ready to help you with any questions about implementing Web3 technologies in your enterprise."
    });
};

// Resources content
export const getResourcesContent = () => {
    return Maybe.Just({
        heading: "Resources",
        description: "For more detailed information, check out our:",
        resources: [
            "Documentation",
            "Whitepapers",
            "Case Studies",
            "Development Guides"
        ]
    });
}; 