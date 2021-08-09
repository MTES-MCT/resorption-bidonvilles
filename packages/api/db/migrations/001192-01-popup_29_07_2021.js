const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.9.0',
    date: new Date(2021, 6, 29),
    items: [
        {
            title: 'Restez informé des activités sur votre territoire grâce à la rubrique Dernières activités',
            description: '<p>Manquez aucune information ! Nouveau site, Fermeture de site, modification des données du site, nouveau message dans le journal du site… grâce à la section « Les dernières activités sur votre territoire » sur la liste des sites. Cliquez sur « Voir toutes les activités sur ce territoire » ou rendez-vous sur « Administration » pour accéder à l\'intégralité des activités.</p>',
            image: `${backUrl}/assets/changelog/1.9.0/item_1.gif`,
        },
        {
            title: 'Identifiez les sites où des actions sont engagées afin de résorber le site en 2021',
            description: '<p>Lors de la délégation des crédits 2021, les services de l\'État se sont engagés à résorber des sites, c\'est-à-dire à mettre en place des actions et trouver une solution pérenne en logement ou hébergement pour au moins 66 % des habitants de ces sites. Repérez-les sur votre territoire grâce au filtre « Objectif résorption ».</p>',
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
