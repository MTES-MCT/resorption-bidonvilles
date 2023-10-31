const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.9.5',
    date: new Date(2023, 9, 24),
    items: [
        {
            title: 'Informez de l\'existence d\'un nouveau site et participez à une meilleure connaissance sur votre territoire',
            description: '<p>Vous avez connaissance d\'un site non recensé sur la plateforme ? Informez les administrateurs locaux grâce à notre nouvelle fonctionnalité "Informer d\'un nouveau site". Ainsi, vous faites exister les lieux et personnes en bidonvilles.</p><p><a href="https://www.blog-resorption-bidonvilles.fr/post/informer-d-un-nouveau-site-une-nouvelle-possibilit%C3%A9-donn%C3%A9e-aux-utilisateurs-pour-une-plateforme" class="link">Plus d\'informations</a></p>',
            image: `${backUrl}/assets/changelog/2.5.0/item_1.png`,
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
