const { backUrl } = require('./config/config');

const changelog = {
    app_version: '2.25.4',
    date: new Date(2025, 1, 22),
    items: [
        {
            title: 'Renseignement du nombre des femmes et filles sur un site',
            description: `<p>Vous pouvez maintenant préciser le nombre de femmes et filles, dans la rubrique Habitants.<br/>
            Cette information permettra de mettre en place des actions spécifiques pour ce public.</p>`,
            image: `${backUrl}/assets/changelog/2.25.4/item_1.png`,
        },
        {
            title: 'Un nouveau filtre sur la liste des sites',
            description: `<p>Vous pouvez maintenant filtrer les sites  contenant exclusivement des ressortissants de l’Union Européenne.<br/>
            Pas de changement sur les filtres existants  : vous pouvez toujours filtrer les sites incluant des Français OU des ressortissants UE OU des ressortissants Hors UE OU des habitants dont l’origine n’a pas été renseignée.<br/>
            Le bouton Effacer permet d’effacer les filtres.</p>`,
            image: `${backUrl}/assets/changelog/2.25.4/item_2.png`,
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
