const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.49.1',
    date: new Date('2026-04-02T00:01:00'),
    items: [
        {
            title: 'Une nouvelle fonctionnalité est disponible !',
            description: '<p>Vous pouvez désormais télécharger les données du volet "actions" dans la liste des actions.</p>',
            image: `${backUrl}/assets/changelog/2.49.1/item_1.jpg`,
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
