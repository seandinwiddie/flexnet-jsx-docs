import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Lorem Ipsum Dolor Sit",
        subtitle: "Lorem ipsum dolor sit amet consectetur adipiscing elit"
    });
};

// Search and categories content
export const getSearchCategoriesContent = () => {
    return Maybe.Just({
        categories: [
            "Lorem",
            "Ipsum",
            "Dolor",
            "Sit",
            "Amet"
        ]
    });
};

// FAQ categories content
export const getFAQCategoriesContent = () => {
    return Maybe.Just({
        categories: [
            {
                name: "Lorem Ipsum",
                questions: [
                    {
                        question: "Lorem ipsum dolor sit amet?",
                        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    },
                    {
                        question: "Sed do eiusmod tempor incididunt?",
                        answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    },
                    {
                        question: "Duis aute irure dolor in reprehenderit?",
                        answer: "In voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident."
                    }
                ]
            },
            {
                name: "Lorem Ipsum Dolor",
                questions: [
                    {
                        question: "Sunt in culpa qui officia deserunt?",
                        answer: "Mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque."
                    },
                    {
                        question: "Laudantium totam rem aperiam?",
                        answer: "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                    },
                    {
                        question: "Nemo enim ipsam voluptatem?",
                        answer: "Quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione."
                    },
                    {
                        question: "Voluptatem sequi nesciunt neque?",
                        answer: "Porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia."
                    }
                ]
            },
            {
                name: "Lorem Ipsum Sit",
                questions: [
                    {
                        question: "Non numquam eius modi tempora?",
                        answer: "Incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam."
                    },
                    {
                        question: "Quis nostrum exercitationem ullam?",
                        answer: "Corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur quis autem vel eum."
                    },
                    {
                        question: "Iure reprehenderit qui in ea?",
                        answer: "Voluptate velit esse quam nihil molestiae consequuntur vel illum qui dolorem eum fugiat quo voluptas."
                    },
                    {
                        question: "Nulla pariatur at vero eos?",
                        answer: "Et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque."
                    }
                ]
            },
            {
                name: "Lorem Ipsum Amet",
                questions: [
                    {
                        question: "Corrupti quos dolores et quas?",
                        answer: "Molestias excepturi sint occaecati cupiditate non provident similique sunt in culpa qui officia."
                    },
                    {
                        question: "Deserunt mollitia animi id est?",
                        answer: "Laborum et dolorum fuga et harum quidem rerum facilis est et expedita distinctio nam libero."
                    },
                    {
                        question: "Tempore cum soluta nobis est?",
                        answer: "Eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus."
                    },
                    {
                        question: "Omnis voluptas assumenda est omnis?",
                        answer: "Dolor repellendus temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe."
                    }
                ]
            }
        ]
    });
};

// Contact content
export const getContactContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor Sit?",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    });
};

// Resources content
export const getResourcesContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum",
        description: "Lorem ipsum dolor sit amet consectetur:",
        resources: [
            "Lorem Ipsum",
            "Dolor Sit",
            "Amet Consectetur",
            "Adipiscing Elit"
        ]
    });
}; 