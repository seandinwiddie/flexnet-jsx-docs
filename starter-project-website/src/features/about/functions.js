import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Lorem Ipsum",
        subtitle: "Lorem Ipsum Dolor Sit Amet Consectetur"
    });
};

// Company overview content
export const getCompanyOverviewContent = () => {
    return Maybe.Just({
        paragraph1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        paragraph2: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    });
};

// Vision and mission content
export const getVisionMissionContent = () => {
    return Maybe.Just({
        visionHeading: "Lorem Ipsum",
        visionStatement: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
        missionHeading: "Lorem Ipsum",
        missionStatement: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum."
    });
};

// Leadership team content
export const getLeadershipTeamContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor",
        members: [
            {
                name: "Lorem Ipsum",
                title: "Lorem Ipsum",
                bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam."
            }
        ]
    });
};

// Approach content
export const getApproachContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor Sit",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua:",
        priorities: [
            'Lorem ipsum dolor sit amet',
            'Consectetur adipiscing elit',
            'Sed do eiusmod tempor',
            'Incididunt ut labore et dolore',
            'Magna aliqua ut enim ad minim',
            'Veniam quis nostrud exercitation'
        ]
    });
};

// Innovations content
export const getInnovationsContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor:",
        innovations: [
            {
                name: "Lorem Ipsum Dolor",
                description: "Lorem ipsum dolor sit amet consectetur"
            },
            {
                name: "Lorem Ipsum Dolor Sit",
                description: "Sed do eiusmod tempor incididunt ut labore"
            },
            {
                name: "Lorem Ipsum Dolor Sit Amet",
                description: "Ut enim ad minim veniam quis nostrud"
            },
            {
                name: "Lorem Ipsum Dolor",
                description: "Duis aute irure dolor in reprehenderit"
            },
            {
                name: "Lorem Ipsum",
                description: "Excepteur sint occaecat cupidatat non proident"
            }
        ]
    });
};

// Partners content
export const getPartnersContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor Sit",
        description: "[Lorem ipsum dolor sit amet]",
        partners: []
    });
};

// CTA content
export const getCTAContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    });
}; 