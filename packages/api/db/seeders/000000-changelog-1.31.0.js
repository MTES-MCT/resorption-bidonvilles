const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.31.0',
    date: new Date(2022, 7, 1),
    items: [
        {
            title: 'Les conditions de vie évoluent : mettez-les à jour !',
            description: `<p>De nouveaux champs plus précis vous permettent de caractériser les typologies d’accès à l’eau, à l’électricité et à des toilettes.<br/>
            Ils se présentent sous forme de boutons, suivis de plusieurs questions progressives qui vous aident à décrire au mieux les conditions de vie de chaque bidonville. Actualisez dès à présent les sites où vous intervenez !</p>`,
            image: `${backUrl}/assets/changelog/1.31.0/item_1.png`,
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
