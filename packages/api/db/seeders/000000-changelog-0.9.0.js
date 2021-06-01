const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.9.0',
    date: new Date(2020, 10, 15),
    items: [
        {
            title: 'Résorption-bidonvilles évolue pour faciliter l’accès vers l’aide alimentaire',
            description: '<p>Visualiser sur la cartographie des implantations des bidonvilles et squats les <strong>structures d’aide alimentaire</strong> ouvertes aux personnes précaires.</p><p>Les adresses, horaires et services de ces structures sont des données fournies par <a href="https://soliguide.fr/">Soliguide</a> pour toute la France et plus particulièrement pour 8 départements (33, 44, 67, 75, 78, 92, 93, 94).</p>',
            image: `${backUrl}/assets/changelog/0.9.0/item_1.png`,
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
