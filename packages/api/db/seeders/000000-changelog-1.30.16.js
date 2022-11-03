const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.30.16',
    date: new Date(2022, 4, 30),
    items: [
        {
            title: 'Exportez la fiche d’un site au format ODT',
            description: '<p>Vous pouvez désormais <strong>exporter la fiche d’un site au format ODT</strong> en vous rendant sur la fiche d’un site et en cliquant sur le bouton “Exporter”.<br/>Vous téléchargerez ainsi des données par défaut et pourrez sélectionner les informations supplémentaires dont vous souhaitez bénéficier.</p>',
            image: `${backUrl}/assets/changelog/1.30.16/item_1.png`,
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
