const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.19.0',
    date: new Date(2022, 1, 28),
    items: [
        {
            title: 'Indiquez les réinstallations',
            description: '<p>Votre plateforme s’enrichit avec la question “S\'agit-il d\'une réinstallation ?”. Si la majorité des habitants était déjà sur un site du territoire, vous pouvez désormais le signaler lors de la déclaration ou de la mise à jour du nouveau site.</p>',
            image: `${backUrl}/assets/changelog/1.19.0/suivi-reinstallation.png`,
        },
        {
            title: 'Partagez vos actions anti-Covid dans la rubrique “Commentaires Covid-19” d’un site !',
            description: '<p>Simplifiez vos remontées d’information en utilisant la plateforme. Partagez directement à tous les acteurs les actions que vous menez contre le Covid-19 en utilisant la rubrique “Commentaires Covid-19” du site où vous intervenez. Exportez les données grâce à “Exporter” et en filtrant sur “Commentaires Covid-19”.</p>',
            image: `${backUrl}/assets/changelog/1.19.0/commentaires-covid.png`,
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
