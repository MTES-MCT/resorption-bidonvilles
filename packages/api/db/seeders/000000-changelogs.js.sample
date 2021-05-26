const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '0.6.3',
    date: new Date(2020, 3, 30),
    items: [
        {
            title: 'Export en Excel des informations sur les sites de votre territoire dont les commentaires « Covid » et « classiques ».',
            description: `<p>Dans le cadre du Covid, cet export permet aux DDCS, préfectures, associations et collectivités territoriales utilisatrices de pouvoir :
                <ul>
                    <li>identifier les interventions sur chaque site</li>
                    <li>analyser les problématiques de chaque site</li>
                    <li>repérer les sites sans intervention.</li>
                </um>
            </p>`,
            image: `${backUrl}/assets/changelog/0.6.3/item_1.jpg`,
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
