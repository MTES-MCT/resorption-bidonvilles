const { sequelize } = require('#db/models');

module.exports = async (id) => {
    const promises = [
        sequelize.query(
            'DELETE FROM shantytowns WHERE shantytown_id = :id',
            {
                replacements: {
                    id,
                },
            },
        ),
        sequelize.query(
            'DELETE FROM "ShantytownHistories" WHERE shantytown_id = :id',
            {
                replacements: {
                    id,
                },
            },
        ),
    ];
    await Promise.all(promises);
};
