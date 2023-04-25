const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.4.0',
    date: new Date(2023, 3, 25),
    items: [
        {
            title: 'Tout ce que vous voulez savoir sur les bidonvilles !',
            description: '<p>Vous pouvez désormais poser toutes les questions que vous souhaitez à la communauté des 1 400 utilisateurs de la plateforme grâce à un nouvel espace d\'entraide ! Rendez-vous dans l’onglet communauté !</p>',
            image: `${backUrl}/assets/changelog/2.4.0/item_1.png`,
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
