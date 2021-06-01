const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.11.0',
    date: new Date(2021, 1, 1),
    items: [
        {
            title: 'L\'essentiel en un coup d\'œil pour définir les actions à mener',
            description: `<p>La plateforme fait peau neuve pour améliorer la lisibilité des informations essentielles afin de pré-diagnostiquer un site. <strong>Acteurs, saisissez-vous des données pour agir !</strong></p><p><a href="${backUrl}/assets/guide_utilisateur/guide_utilisateur_2021_02.pdf" class="link">Le guide utilisateur</a> est téléchargeable pour prendre en main la nouvelle version.</p>`,
            image: `${backUrl}/assets/changelog/0.11.0/item_1.png`,
        },
        {
            title: 'Partagez et communiquez une synthèse des bidonvilles et squats sur votre territoire grâce à l\'export pdf de la liste des sites !',
            description: '',
            image: `${backUrl}/assets/changelog/0.11.0/item_2.png`,
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
