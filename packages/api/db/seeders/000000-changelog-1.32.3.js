const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.32.3',
    date: new Date(2022, 6, 27),
    items: [
        {
            title: 'Partagez vos messages en les réservant aux acteurs de votre choix !',
            description: '<p>Utilisez le <strong>journal du site</strong> pour <strong>transmettre des informations</strong>, parfois à caractère sensible, <strong>à un groupe d’acteurs précis en quelques clics</strong>. Cela vous permet de gagner du temps dans vos échanges et de suivre la vie du site à un seul endroit. <strong>Testez la fonctionnalité dès maintenant !</strong> Évidemment, le partage d’une information à tous les acteurs du territoire est toujours possible.</p>',
            image: `${backUrl}/assets/changelog/1.32.3/item_1.png`,
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
