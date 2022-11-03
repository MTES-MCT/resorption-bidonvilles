const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.27.5',
    date: new Date(2022, 2, 15),
    items: [
        {
            title: 'L\'onglet DISPOSITIFS devient ACTIONS',
            description: '<p>Afin que la plateforme s’adapte à vos missions et aux actions que vous mettez en place pour accompagner les habitants des bidonvilles, <strong>l’onglet <em>DISPOSITIFS</em> qui regroupait les actions financées et cofinancées change de nom et devient <em>ACTIONS</em>.</strong></p>',
            image: `${backUrl}/assets/changelog/1.27.5/item_1.png`,
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
