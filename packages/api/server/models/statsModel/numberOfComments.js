const { sequelize } = require('#db/models');

module.exports = async () => {
    const rows = await sequelize.query(
        'SELECT COUNT(*) AS total FROM shantytown_comments',
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
