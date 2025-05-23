import Maybe from '../../core/types/maybe.js';

// Page title content
export const getPageTitleContent = () => {
    return Maybe.Just({
        title: "Lorem Ipsum Dolor Sit",
        subtitle: "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing"
    });
};

// Services content
export const getServicesContent = () => {
    return Maybe.Just({
        services: [
            {
                id: 'compute',
                title: 'Lorem Ipsum Dolor',
                icon: '⚡',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                features: [
                    'Lorem ipsum dolor sit',
                    'Consectetur adipiscing elit',
                    'Sed do eiusmod tempor',
                    'Incididunt ut labore et dolore',
                    'Magna aliqua ut enim ad minim'
                ]
            },
            {
                id: 'storage',
                title: 'Lorem Ipsum Dolor Sit',
                icon: '💾',
                description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                features: [
                    'Duis aute irure dolor',
                    'In reprehenderit in voluptate',
                    'Velit esse cillum dolore',
                    'Eu fugiat nulla pariatur',
                    'Excepteur sint occaecat cupidatat'
                ]
            },
            {
                id: 'networks',
                title: 'Lorem Ipsum Dolor Sit Amet',
                icon: '🌐',
                description: 'Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis.',
                features: [
                    'Unde omnis iste natus',
                    'Error sit voluptatem accusantium',
                    'Doloremque laudantium totam',
                    'Rem aperiam eaque ipsa',
                    'Quae ab illo inventore'
                ]
            },
            {
                id: 'contracts',
                title: 'Lorem Ipsum Dolor',
                icon: '📋',
                description: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.',
                features: [
                    'Quia voluptas sit aspernatur',
                    'Aut odit aut fugit',
                    'Sed quia consequuntur magni',
                    'Dolores eos qui ratione',
                    'Voluptatem sequi nesciunt'
                ]
            },
            {
                id: 'identity',
                title: 'Lorem Ipsum Dolor Sit',
                icon: '🔐',
                description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
                features: [
                    'Lorem ipsum dolor sit amet',
                    'Consectetur adipiscing elit',
                    'Sed do eiusmod tempor',
                    'Incididunt ut labore et dolore',
                    'Magna aliqua ut enim ad minim'
                ]
            },
            {
                id: 'tokenization',
                title: 'Lorem Ipsum Dolor',
                icon: '🪙',
                description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
                features: [
                    'Totam rem aperiam eaque',
                    'Ipsa quae ab illo',
                    'Inventore veritatis et quasi',
                    'Architecto beatae vitae dicta',
                    'Sunt explicabo nemo enim'
                ]
            }
        ]
    });
};

// AI Integration content
export const getAIIntegrationContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor Sit Amet",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt:",
        benefits: [
            'Lorem ipsum dolor sit amet',
            'Consectetur adipiscing elit sed do',
            'Eiusmod tempor incididunt ut labore',
            'Et dolore magna aliqua ut enim',
            'Ad minim veniam quis nostrud'
        ]
    });
};

// Pricing packages content
export const getPricingPackagesContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor Sit",
        packages: [
            {
                name: "Lorem Ipsum",
                features: [
                    'Lorem ipsum dolor',
                    'Consectetur adipiscing',
                    'Sed do eiusmod',
                    'Tempor incididunt ut labore'
                ]
            },
            {
                name: "Lorem Ipsum Dolor",
                featured: true,
                features: [
                    'Et dolore magna aliqua',
                    'Ut enim ad minim veniam',
                    'Quis nostrud exercitation',
                    'Ullamco laboris nisi ut'
                ]
            },
            {
                name: "Lorem Ipsum Dolor Sit",
                features: [
                    'Aliquip ex ea commodo',
                    'Consequat duis aute irure',
                    'Dolor in reprehenderit',
                    'In voluptate velit esse'
                ]
            }
        ]
    });
};

// Consultation CTA content
export const getConsultationCTAContent = () => {
    return Maybe.Just({
        heading: "Lorem Ipsum Dolor Sit Amet",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    });
}; 