const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.12.0',
    date: new Date(2024, 0, 23),
    items: [
        {
            title: 'Partager des photos ou des documents est désormais possible !',
            description: `<p>Envie de transmettre la photo d'un site ? une installation endommagée ?<br/>
            À vos clics pour enrichir le journal de site, le journal de l'action, les questions et les réponses déposées dans l'espace d'entraide avec des documents joints.</p>`,
            image: `${backUrl}/assets/changelog/2.12.0/item_1.png`,
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
