const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.15.0',
    date: new Date(2021, 3, 5),
    items: [
        {
            title: 'Acteur de terrain, valorisez votre présence sur les sites',
            description: '<p>Le bouton “j’interviens ici” présent sur la fiche site permet aux acteurs de terrain de signaler leur action, d’intégrer la communauté d’acteurs d’un site pour plus de synergies !</p>',
            image: `${backUrl}/assets/changelog/0.15.0/item_1.jpg`,
        },
        {
            title: 'Identifiez les actions à mener pour améliorer les conditions de vie',
            description: '<p>Un formulaire plus précis permet aux acteurs de terrain de relever les installations existantes sur un site et ainsi aux pilotes d\'identifier des axes d\'améliorations.</p>',
            image: `${backUrl}/assets/changelog/0.15.0/item_2.png`,
        },
        {
            title: 'Partagez des informations aux acteurs sur le journal du site',
            description: 'L\'espace journal du site est à présent ouvert à tous les utilisateurs de la plateforme pour favoriser la circulation d\'informations cruciales entre toutes les parties prenantes, institutionnels et associatives.',
            image: `${backUrl}/assets/changelog/0.15.0/item_3.png`,
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
