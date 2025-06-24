const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.33.4',
    date: new Date('2025-06-24T02:24:00'),
    items: [
        {
            title: 'Le blog est de retour avec un nouveau design !',
            description: '<p>Retrouverez toutes les actualités de la résorption des bidonvilles au niveau national et dans les territoires, ainsi que des ressources que nous mettons à votre disposition (fiches repères, guides pratiques, conseils) et des contenus exclusifs autour de thématiques variées (insertion, scolarisation, santé, traite des êtres humains...)</p>',
            image: `${backUrl}/assets/changelog/2.33.4/item_1.jpg`,
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
