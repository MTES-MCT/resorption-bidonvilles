const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.27.3',
    date: new Date(2025, 2, 24),
    items: [
        {
            title: 'Nouvel onglet scolarisation',
            description: '<p>Nous vous proposons un nouvel onglet dans la partie visualisation des données.</p>',
            image: `${backUrl}/assets/changelog/2.27.3/item_1.png`,
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
