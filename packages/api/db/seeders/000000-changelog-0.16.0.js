const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.16.0',
    date: new Date(2021, 4, 3),
    items: [
        {
            title: 'Visualisez mieux les sites sur votre territoire grâce au tri par commune',
            description: '<p>Les sites sont désormais triés par le nom des communes pour se repérer plus facilement dans la liste des sites ! Les tris par date d’actualisation, d’installation, de signalement restent disponibles.</p>',
            image: `${backUrl}/assets/changelog/0.16.0/sort-name-h400.gif`,
        },
        {
            title: 'Trouvez rapidement un site par son nom ou son appellation',
            description: '<p>Le champ de recherche de la liste des sites s’enrichit pour vous permettre de retrouver rapidement un site par son nom ou son appellation et de filtrer par code postal.</p>',
            image: `${backUrl}/assets/changelog/0.16.0/search-name-h400.gif`,
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
