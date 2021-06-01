const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.10.0',
    date: new Date(2021, 0, 1),
    items: [
        {
            title: 'Mieux identifier les besoins en terme de scolarisation.',
            description: '<p><strong>Favoriser l’inscription des enfants et la visibilité des mineurs présents sur un site</strong> grâce à la connaissance des mineurs par tranche d\'âge. Ces informations sont clés pour l’action des autorités concernées (collectivités locales, DSDEN, Casnav...), grâce à une évaluation plus précise du nombre d\'enfants non scolarisés. Intervenants de terrain et médiateurs scolaires, partager ces informations dès maintenant !</p>',
            image: `${backUrl}/assets/changelog/0.10.0/item_1.png`,
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
