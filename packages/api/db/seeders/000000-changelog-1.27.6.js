const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.27.6',
    date: new Date(2022, 2, 21),
    items: [
        {
            title: 'La plateforme fait peau neuve pour un meilleur pilotage et suivi des actions ',
            description: '<p>Votre plateforme évolue et s’adapte continuellement à vos besoins. Découvrez les nouveaux changements qui vont <strong>simplifier votre utilisation de l’outil et mieux vous accompagner dans la mise en œuvre de vos actions.</strong></p>',
            image: `${backUrl}/assets/changelog/1.27.6/item_1.jpg`,
        },
        {
            title: 'Une nouvelle page d\'accueil pour vous appuyer dans vos actions',
            description: '<p>En vous connectant à la plateforme, vous accédez aux informations essentielles sur les bidonvilles de votre territoire. En un coup d\'œil, <strong>vous pouvez suivre l’évolution de vos indicateurs clés, accéder aux sites de votre territoire et être informé(e) des dernières activités.</strong> Des données actualisées plus lisibles pour vous appuyer dans vos actions !</p>',
            image: `${backUrl}/assets/changelog/1.27.6/item_2.gif`,
        },
        {
            title: 'Une navigation plus claire et plus simple',
            description: '<p>Les onglets de la plateforme évoluent pour rendre votre navigation plus agréable, plus lisible et plus efficace. Cette nouvelle navigation <strong>vous permet de voir en un instant l’ensemble du contenu de la plateforme et d’y accéder plus rapidement.</strong></p>',
            image: `${backUrl}/assets/changelog/1.27.6/item_3.jpg`,
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
