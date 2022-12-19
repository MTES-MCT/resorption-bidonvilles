const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.0.10',
    date: new Date(2022, 11, 20),
    items: [
        {
            title: 'La plateforme dans votre poche !',
            description: '<p>Rendez-vous sur votre téléphone portable pour découvrir la première version mobile qui vous permettra de consulter la fiche d\'un site, d\'écrire sur le journal du site et de créer des notes personnelles. Pour vous connecter, utilisez la même adresse : https://resorption-bidonvilles.beta.gouv.fr/ et vos identifiants habituels.</p>',
            image: `${backUrl}/assets/changelog/2.0.10/item_1.jpeg`,
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
