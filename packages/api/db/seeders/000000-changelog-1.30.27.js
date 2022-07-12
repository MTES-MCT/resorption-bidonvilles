const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.30.27',
    date: new Date(2022, 6, 4),
    items: [
        {
            title: 'Renseignez le nombre de caravanes et cabanes sur un site',
            description: '<p>Rendez-vous dans la rubrique “Habitants” de la fiche d’un site pour <strong>indiquer le nombre de caravanes et de cabanes présentes sur le lieu.</strong><br/>Vous pouvez l’indiquer dès la déclaration du campement ou modifier les données d’un bidonville déjà présent sur la plateforme.</p>',
            image: `${backUrl}/assets/changelog/1.30.27/item_1.png`,
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
