const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        closing_solutions.closing_solution_id AS id,
        closing_solutions.label AS label
    FROM closing_solutions`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
