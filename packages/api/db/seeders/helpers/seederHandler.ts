const createTransactionalSeeder = require('./seederTransaction');

module.exports = function createChangelogSeeder({ app_version, date, items }) {
    return createTransactionalSeeder(
        (qi, transaction) => qi
            .bulkInsert(
                'changelogs',
                [{ app_version, date }],
                { transaction },
            )
            .then(() => qi.bulkInsert(
                'changelog_items',
                items.map(({ title, description, image }, position) => ({
                    title,
                    description,
                    image,
                    position,
                    fk_changelog: app_version,
                })),
                { transaction },
            )),
        (qi, transaction) => Promise.all([
            qi.bulkDelete('changelog_items', { fk_changelog: app_version }, { transaction }),
            qi.bulkDelete('changelogs', { app_version }, { transaction }),
        ]),
    );
};
