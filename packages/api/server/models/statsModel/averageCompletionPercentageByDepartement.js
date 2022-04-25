const sequelize = require('#db/sequelize');
const averageCompletionQuery = require('./_common/averageCompletion');

module.exports = async () => sequelize.query(
    `SELECT
            fk_departement, AVG(pourcentage_completion)
            FROM
            ${averageCompletionQuery()}    
            GROUP BY fk_departement
            ORDER BY fk_departement`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
