const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.25.4',
    date: new Date(2025, 1, 24),
    items: [
        {
            title: 'Nouvelle page d’accueil',
            description: '<p>Avec le changement de nom de domaine, nous avons souhaité vous proposer une nouvelle page d’accueil plus lisible, regroupant les principales fonctionnalités, dans le but de faciliter vos activités sur la plate-forme.</p>',
            image: `${backUrl}/assets/changelog/2.26.1/item_1.png`,
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
