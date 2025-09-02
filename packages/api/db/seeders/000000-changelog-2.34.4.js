const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.34.4',
    date: new Date('2025-07-15T02:24:00'),
    items: [
        {
            title: 'Connaître le nom du propriétaire du terrain',
            description: '<p>Vos correspondants en DDETS peuvent maintenant obtenir le nom du propriétaire du terrain sur lequel est installé le bidonville, dans l’objectif de faciliter les contacts et accélérer la mise en place des premières mesures.</p><p>Cette nouvelle fonctionnalité de la plate-forme se base sur la localisation du site par rapport au cadastre et sur les données de la DGFIP.</p><p>N’hésitez pas à les contacter.</p>',
            image: `${backUrl}/assets/changelog/2.34.4/item_1.jpg`,
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
