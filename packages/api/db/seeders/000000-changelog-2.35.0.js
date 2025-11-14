const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.35.0',
    date: new Date('2025-10-13T02:24:00'),
    items: [
        {
            title: 'Un nouvel article est disponible sur le blog',
            description: '<p>Retour sur la vague de chaleur estivale: <a href="https://blog.resorption-bidonvilles.dihal.gouv.fr/blog-r%C3%A9sorption-bidonvilles/retour-sur-la-vague-de-chaleur-estivale-bilan-des-alertes-canicules-de-la-plateforme/" style="color: blue !important; text-decoration: underline !important;">bilan des alertes canicules de la plateforme</a>.</p>',
            image: `${backUrl}/assets/changelog/2.35.0/item_1.jpg`,
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
