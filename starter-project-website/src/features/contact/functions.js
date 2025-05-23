import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Lorem Ipsum",
        subtitle: "Lorem Ipsum Dolor Sit Amet Consectetur"
    });
};

// Contact options content
export const getContactOptionsContent = () => {
    return Maybe.Just({
        formHeading: "Lorem Ipsum Dolor",
        directHeading: "Lorem Ipsum",
        contactInfo: [
            {
                type: "Lorem Ipsum:",
                value: "lorem@ipsum.com"
            },
            {
                type: "Lorem Ipsum:",
                value: "dolor@ipsum.com"
            },
            {
                type: "Lorem Ipsum:",
                value: "sit@amet.com"
            },
            {
                type: "Lorem:",
                value: "+1 (555) 000-0000"
            }
        ],
        locationLabel: "Lorem Ipsum:",
        address1: "123 Lorem Ipsum Street, Suite 000",
        address2: "Dolor Sit, Amet",
        address3: "Lorem Ipsum"
    });
};

// Demo content
export const getDemoContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
    });
};

// Project consultation content
export const getProjectConsultationContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
    });
};

// FAQ preview content
export const getFAQPreviewContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor Sit",
        questions: [
            "Lorem ipsum dolor sit amet consectetur?",
            "Sed do eiusmod tempor incididunt?",
            "Ut labore et dolore magna aliqua?",
            "Quis nostrud exercitation ullamco?"
        ]
    });
};

// Locations content
export const getLocationsContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum",
        headquarters: "Lorem Ipsum",
        regionalOffices: "Dolor Sit, Amet Consectetur, Adipiscing Elit"
    });
}; 