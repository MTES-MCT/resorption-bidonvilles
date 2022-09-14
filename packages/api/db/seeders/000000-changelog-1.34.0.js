const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.34.0',
    date: new Date(2022, 8, 14),
    items: [
        {
            title: '"Le journal de l\'action" : un lien entre les acteurs pour accélérer les actions / les interventions',
            description: `<p>A travers, le "Journal de l'action" situé en bas des fiches de chaque action, les acteurs de terrain peuvent partager des informations qualitatives sur leurs interventions, interroger d'autres intervenants et les pilotes peuvent suivre au plus près les actions menées auprès des habitants des bidonvilles.<br/>
            Partagez dès maintenant vos actions de la journée !</p>
            <p>Tous les acteurs concernés par l\'action seront avertis par mail de votre message et pourront le consulter sur la plateforme.</p>`,
            image: `${backUrl}/assets/changelog/1.34.0/item_1.jpeg`,
        },
        {
            title: 'Consultez les informations sur l\'orientation des ménages directement sur la fiche d\'un site fermé',
            description: '<p>Connaître et objectiver les causes de la fermeture d\'un site et les orientations des personnes sont les enjeux de ce nouveau formulaire de fermeture d\'un site. Les données sont disponibles dans l\'export Excel de la liste des sites et à présent aussi sur la fiche d\'un site fermé.</p>',
            image: `${backUrl}/assets/changelog/1.34.0/item_2.jpeg`,
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
