const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.3.6',
    date: new Date(2023, 3, 2),
    items: [
        {
            title: 'La plateforme dans votre poche !',
            description: '<p>Rendez-vous sur votre téléphone portable pour découvrir la première version mobile qui vous permettra de consulter la fiche d\'un site, d\'écrire sur le journal du site et de créer des notes personnelles. Pour vous connecter, utilisez la même adresse : https://resorption-bidonvilles.beta.gouv.fr/ et vos identifiants habituels.</p>',
            image: `${backUrl}/assets/changelog/2.3.6/item_1.jpeg`,
        },
        {
            title: 'Faites-le bilan de vos actions !',
            description: '<p>Rendez-vous sur le volet action pour déclarer vos actions et transmettre vos résultats 2022. Une belle occasion de valoriser le travail de terrain mené !</p>',
            image: `${backUrl}/assets/changelog/2.3.6/item_2.gif`,
        },
    ],
};

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'changelogs',
            [{
                app_version: changelog.app_version,
                date: changelog.date,
            }],
            {
                transaction,
            },
        )
            .then(() => queryInterface.bulkInsert(
                'changelog_items',
                changelog.items.map(({ title, description, image }, position) => ({
                    title,
                    description,
                    image,
                    position,
                    fk_changelog: changelog.app_version,
                })),
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.bulkDelete(
        'changelogs',
        {
            app_version: changelog.app_version,
        },
    ),
};
