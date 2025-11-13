const fs = require('node:fs');
const path = require('node:path');
const createTransactionalSeeder = require('./seederTransaction');
const { backUrl } = require('../config/config');

/**
 * Crée un seeder de changelog à partir d'un fichier JSON
 * @param {string} jsonFileName - Nom du fichier JSON (ex: "2.34.4.json")
 * @returns {object} Seeder Sequelize avec méthodes up et down
 */

module.exports = function createChangelogSeederFromJson(jsonFileName) {
    // Charger le fichier JSON
    const jsonPath = path.join(__dirname, '../data/changelogs', jsonFileName);

    if (!fs.existsSync(jsonPath)) {
        throw new Error(`Fichier JSON introuvable : ${jsonPath}`);
    }

    const changelogData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    if (!changelogData.release || !changelogData.date || !Array.isArray(changelogData.items)) {
        throw new Error(`Format JSON invalide dans ${jsonFileName}. Propriétés requises : release, date, items`);
    }

    const { release, date, items } = changelogData;

    // Transformer les données pour le seeder
    const changelog = {
        app_version: release,
        date: new Date(date),
        items: items.map(item => ({
            title: item.title,
            description: item.description,
            image: `${backUrl}/assets/changelog/${release}/${item.image}`,
        })),
    };

    // Créer le seeder transactionnel
    return createTransactionalSeeder(
        (qi, transaction) => qi
            .bulkInsert(
                'changelogs',
                [{ app_version: changelog.app_version, date: changelog.date }],
                { transaction },
            )
            .then(() => qi.bulkInsert(
                'changelog_items',
                changelog.items.map(({ title, description, image }, position) => ({
                    title,
                    description,
                    image,
                    position,
                    fk_changelog: changelog.app_version,
                })),
                { transaction },
            )),
        (qi, transaction) => Promise.all([
            qi.bulkDelete('changelog_items', { fk_changelog: changelog.app_version }, { transaction }),
            qi.bulkDelete('changelogs', { app_version: changelog.app_version }, { transaction }),
        ]),
    );
};
