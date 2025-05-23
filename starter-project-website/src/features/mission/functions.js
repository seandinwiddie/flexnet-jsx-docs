import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Lorem Ipsum"
    });
};

// Mission statement content
export const getMissionStatementContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum",
        statement: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
        tagline: "Lorem Ipsum Dolor Sit - Amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    });
};

// Vision and values content
export const getVisionValuesContent = () => {
    return Maybe.Just({
        visionHeading: "Lorem Ipsum",
        visionStatement: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud.",
        valuesHeading: "Lorem Ipsum",
        values: [
            {
                name: "Lorem Ipsum",
                description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor."
            },
            {
                name: "Lorem Ipsum",
                description: "Incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis."
            },
            {
                name: "Lorem Ipsum",
                description: "Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            {
                name: "Lorem Ipsum",
                description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."
            }
        ]
    });
};

// Impact goals content
export const getImpactGoalsContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor",
        introduction: "Lorem ipsum dolor:",
        goals: [
            "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod",
            "Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam",
            "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo",
            "Consequat duis aute irure dolor in reprehenderit in voluptate velit esse",
            "Cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat"
        ]
    });
};

// Leadership message content
export const getLeadershipMessageContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor",
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        attribution: "Lorem Ipsum, Lorem Ipsum"
    });
};

// Join us content
export const getJoinUsContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        buttons: [
            {
                text: "Lorem Ipsum",
                action: "contact"
            },
            {
                text: "Lorem Ipsum",
                action: "services"
            },
            {
                text: "Lorem Ipsum",
                action: "about"
            }
        ]
    });
}; 