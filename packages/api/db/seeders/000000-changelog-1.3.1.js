const { backUrl } = require('../../server/config');

const changelog = {
    app_version: '1.3.1',
    date: new Date(2021, 6, 17),
    items: [
        {
            title: 'La fonctionnalité « Journal du site » permet d’aller plus loin dans le suivi en temps réel des actions grâce au système de notification dès la publication d’un nouveau message',
            description: `<p>Vous intervenez sur un site ? Vous souhaitez informer et être informé des actions mises en place, signaler une situation ? Utilisez le "Journal du site" pour partager rapidement et simplement des informations aux partenaires et transmettre des points d’attention aux pouvoirs publics.</p>
            <p>[NOUVEAU] En vous déclarant intervenant sur un site, vous recevrez des alertes mail à chaque nouveau message dans le journal du site. Chaque nouveau message est également transmis aux acteurs en DDETS, Préfecture et à la Dihal.</p>`,
            image: `${backUrl}/assets/changelog/1.3.1/visuel_plateforme_rb_2021_site.jpg`,
        },
        {
            title: 'La plateforme améliore la circulation de l\'information grâce aux notifications mails à chaque déclaration et fermeture de site',
            description: '<p>En tant qu\'acteur de la résorption des bidonvilles sur votre territoire, vous êtes informé instantanément d\'un nouveau site ou d\'une fermeture. Ainsi, dès le signalement, tous les acteurs du territoire utilisateurs de la plateforme sont avertis par mail.</p>',
            image: `${backUrl}/assets/changelog/1.3.1/mail-nouveau-site.jpg`,
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
