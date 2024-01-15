const toBeReindexed = [
    '01-create-table-expertise_topics',
    '02-create-table-user_to_expertise_topics',
    '03-alter-table-users-add-col-expertise_topics_chosen',
    '04-alter-table-users-add-col-expertise_comment',
];

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                toBeReindexed.map(migrationName => queryInterface.sequelize.query(
                    'UPDATE "SequelizeMeta" SET "name" = :newName WHERE "name" = :oldName',
                    {
                        replacements: {
                            newName: `30000067-${migrationName}.js`,
                            oldName: `30000066-${migrationName}.js`,
                        },
                        transaction,
                    },
                )),
            );

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                toBeReindexed.map(migrationName => queryInterface.sequelize.query(
                    'UPDATE "SequelizeMeta" SET "name" = :newName WHERE "name" = :oldName',
                    {
                        replacements: {
                            newName: `30000066-${migrationName}.js`,
                            oldName: `30000067-${migrationName}.js`,
                        },
                        transaction,
                    },
                )),
            );

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
