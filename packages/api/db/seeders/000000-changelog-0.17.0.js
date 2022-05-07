const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.17.0',
    date: new Date(2021, 4, 21),
    items: [
        {
            title: 'Identifiez les actions menées sur un site',
            description: '<p>La fiche site s\'enrichit avec la section "Dispositif" pour connaître en un coup d\'œil les actions menées sur le terrain et accéder à leurs résultats.</p>',
            image: `${backUrl}/assets/changelog/0.17.0/lien-site-dispositif-H400.gif`,
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
