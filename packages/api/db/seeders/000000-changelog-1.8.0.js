const { backUrl, webappUrl } = require('../../server/config');

const changelog = {
    app_version: '1.8.0',
    date: new Date(2021, 6, 26),
    items: [
        {
            title: 'Informez les partenaires des actions que vous menez pour la campagne de sensibilisation et de vaccination anti-Covid',
            description: '<p>En tant qu\'acteur de terrain, signalez vos actions grâce à l\'onglet "Commentaire Covid" et informez-vous des actions menées sur les squats et bidonvilles à travers le "Journal du site".</p>',
            image: `${backUrl}/assets/changelog/1.8.0/item_1.gif`,
        },
        {
            title: 'Retrouvez la fiche "Recommandations vaccination personnes en situation de grande précarité" du Ministère des Solidarités et de la Santé sur l\'onglet Covid-19',
            description: `<p><a href="${webappUrl}/doc/covid-19-recommandations-vaccination.pdf" class="link">Recommandations vaccination personnes en situation de grande précarité</a></p>`,
            image: `${backUrl}/assets/changelog/1.8.0/item_2.jpg`,
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
