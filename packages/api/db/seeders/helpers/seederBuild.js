module.exports = function seeder(changelog) {
    return {
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
};
