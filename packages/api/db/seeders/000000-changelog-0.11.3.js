const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.11.3',
    date: new Date(2021, 1, 18),
    items: [
        {
            title: 'Localisez précisément les sites grâce aux coordonnées GPS',
            description: '<p>Partagez les coordonnées GPS d’un site aux intervenants de votre communauté, créez des cartographies plus précises… tout cela est maintenant possible !</p>',
            image: `${backUrl}/assets/changelog/0.11.3/item_1.png`,
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
