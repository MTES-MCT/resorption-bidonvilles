const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.30.11',
    date: new Date(2022, 4, 18),
    items: [
        {
            title: 'Accédez au cadastre d\'un site',
            description: '<p>En un clic, <strong>consultez les informations et visualisez les délimitations du cadastre sur lequel est positionné un squat ou bidonville.</strong></p><p>Il vous suffit de vous rendre sur la fiche d\'un site, d\'aller sur la carte, et de cocher la case « Voir le cadastre » pour visualiser les parcelles cadastrales. Copiez facilement les coordonnées d\'une parcelle en cliquant dessus.',
            image: `${backUrl}/assets/changelog/1.30.11/item_1.png`,
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
