const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.32.3',
    date: new Date(2025, 5, 26),
    items: [
        {
            title: 'Droit à l\'oubli',
            description: '<p>Conformément au RGPD, la plateforme met en place le droit à l’oubli. Vos données personnelles (nom, prénom, adresse mel, téléphone) sont automatiquement effacées 6 mois après la désactivation de votre compte.</p><p>La désactivation de votre compte intervient 6 mois après votre dernière connexion à la plateforme.</p><p>Vous pouvez également, à tout moment, demander la désactivation de votre compte depuis la page “Mon profil”.</p>',
            image: `${backUrl}/assets/changelog/2.32.3/item_1.png`,
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
