const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.32.0',
    date: new Date(2022, 8, 11),
    items: [
        {
            title: 'Déclarer un site en “alerte canicule”',
            description: `<p>Dorénavant, la plateforme vous permet de déclarer un site en “Alerte Canicule” afin qu’il fasse l’objet d’un suivi particulier en période de fortes chaleurs (en raison bien souvent des conditions de vie, en particulier de l’accès à l’eau). Dans la rubrique “Sites”, en appuyant sur le bouton “Déclencher Alerte Canicule” sur la fiche d’un bidonville ou squat, vous faites apparaître l’étiquette correspondante. Vous pourrez ensuite filtrer les sites exposés, ou les retrouver dans votre export Excel en cochant la case “conditions de vie”
            </p>`,
            image: `${backUrl}/assets/changelog/1.32.0/item_1.jpg`,
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
