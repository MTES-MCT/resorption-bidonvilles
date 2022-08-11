const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.32.2',
    date: new Date(2022, 7, 11),
    items: [
        {
            title: 'Déclarer un site en “alerte canicule”',
            description: `<p>Dorénavant, la plateforme vous permet de déclarer un site en “Alerte Canicule”. Dans la rubrique “Sites”, en appuyant sur le <b>bouton “Déclencher Alerte Canicule”</b> sur la fiche d’un bidonville ou squat, <b>vous faites apparaître l’étiquette correspondante</b>. Vous pourrez ensuite <b>filtrer les sites exposés</b>, ou les retrouver dans votre <b>export Excel</b> en cochant la case “conditions de vie”
            </p>`,
            image: `${backUrl}/assets/changelog/1.32.2/item_1.jpg`,
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
