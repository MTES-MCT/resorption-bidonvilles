const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.33.1',
    date: new Date('2025-06-12T02:24:00'),
    items: [
        {
            title: 'Plus que quelques jours pour donner votre avis !',
            description: '<p>Chers utilisateurs de la plateforme Résorption Bidonvilles,</p><p>Nous vous invitons à répondre à notre questionnaire de satisfaction sur le lien ci-dessous avant le 18 juin&nbsp;</p><p>Questionnaire de satisfaction - Résorption Bidonvilles (lien Questionnaire de satisfaction de la plateforme Résorption Bidonvilles | Framaforms.org )</p><p>Sachez que vos retours sont très précieux et nous comptons sur chacun de vous pour nous aider dans notre mission d’amélioration de la plateforme.</p><p>Un grand merci à vous !</p>',
            image: `${backUrl}/assets/changelog/2.33.1/item_1.png`,
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
