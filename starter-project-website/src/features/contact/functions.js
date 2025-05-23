import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Contact Us",
        subtitle: "Let's Discuss Your Enterprise Web3 Journey"
    });
};

// Contact options content
export const getContactOptionsContent = () => {
    return Maybe.Just({
        formHeading: "Contact Form",
        directHeading: "Direct Contact",
        contactInfo: [
            {
                type: "Sales Inquiries:",
                value: "sales@cryptoversus.io"
            },
            {
                type: "Support:",
                value: "support@cryptoversus.io"
            },
            {
                type: "Partnerships:",
                value: "partners@cryptoversus.io"
            },
            {
                type: "Phone:",
                value: "+1 (555) 123-4567"
            }
        ],
        locationLabel: "Office Location:",
        address1: "123 Enterprise Way, Suite 300",
        address2: "San Francisco, CO",
        address3: "United States"
    });
};

// Demo content
export const getDemoContent = () => {
    return Maybe.Just({
        heading: "Schedule a Demo",
        description: "See our enterprise Web3 platform in action with a personalized demonstration."
    });
};

// Project consultation content
export const getProjectConsultationContent = () => {
    return Maybe.Just({
        heading: "Launch Your Project",
        description: "Our team specializes in helping innovators navigate the path to decentralization. Whether you're exploring Web3 for the first time or scaling an existing project, we provide the guidance and infrastructure you need."
    });
};

// FAQ preview content
export const getFAQPreviewContent = () => {
    return Maybe.Just({
        heading: "Frequently Asked Questions",
        questions: [
            "How quickly can we implement your solutions?",
            "What security measures are in place?",
            "How do you handle regulatory compliance?",
            "How does your platform compare to traditional cloud services?"
        ]
    });
};

// Locations content
export const getLocationsContent = () => {
    return Maybe.Just({
        heading: "Our Locations",
        headquarters: "Colorado",
        regionalOffices: "New York, London, Singapore"
    });
}; 