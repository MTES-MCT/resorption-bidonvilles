const { backUrl } = require('./config/config');
const seeder = require('./helpers/seederBuild');

const changelog = {
    app_version: '2.49.1',
    date: new Date('2026-04-02T02:01:00'),
    items: [
        {
            title: 'Une nouvelle fonctionnalité est disponible !',
            description: '<p>Vous pouvez désormais télécharger les données du volet "actions" dans la liste des actions.</p>',
            image: `${backUrl}/assets/changelog/2.49.1/item_1.jpg`,
        },
    ],
};

module.exports = seeder(changelog);
