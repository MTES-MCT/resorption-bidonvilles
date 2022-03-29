const { sequelize } = require('#db/models');

module.exports = async (id) => {
    const transaction = await sequelize.transaction();
    await sequelize.query(
        'DELETE FROM shantytowns WHERE shantytown_id = :id',
        {
            transaction,
            replacements: {
                id,
            },
        },
    )
        .then(sequelize.query(
            'DELETE FROM "ShantytownHistories" WHERE shantytown_id = :id',
            {
                transaction,
                replacements: {
                    id,
                },
            },
        ));
    await transaction.commit();
};
