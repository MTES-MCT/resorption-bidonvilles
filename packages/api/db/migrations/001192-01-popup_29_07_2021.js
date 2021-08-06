const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.9.0',
    date: new Date(2021, 6, 29),
    items: [
        {
            title: 'Soyez informé des activités sur votre territoire grâce à la rubrique « Dernières activités »',
            description: '<p>Manquez aucun nouveau site ou aucune déclaration d\'un site fermé ; aucune modification des données d\'un site et aucun nouveau message dans le  « Journal du site » grâce à la section « Les dernières activités sur votre territoire » sur la liste des sites. Cliquez sur « Voir toutes les activités sur ce territoire » ou rendez-vous sur « Administration » pour accéder à l\'intégralité des activités.</p>',
            image: `${backUrl}/assets/changelog/1.9.0/item_1.gif`,
        },
        {
            title: 'Identifier les sites où des actions sont engagées afin de résorber le site en 2021',
            description: '<p>Lors de la délégation des crédits 2021, les services de l\'État se sont engagés à résorber des sites, c\'est-à-dire à mettre en place des actions et trouver une solution pérenne en logement ou hébergement pour au moins 66 % des habitants. Repérez ces sites sur votre territoire grâce au filtre « Objectif résorption ».</p>',
            image: `${backUrl}/assets/changelog/1.9.0/item_2.jpg`,
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
