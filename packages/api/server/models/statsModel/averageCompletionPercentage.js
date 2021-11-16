const { sequelize } = require('#db/models');
const averageCompletionQuery = require('./_common/averageCompletion');

module.exports = async (departement) => {
    const rows = await sequelize.query(
        `SELECT
            AVG(pourcentage_completion)
        FROM
        ${averageCompletionQuery(departement)}
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].avg;
};
