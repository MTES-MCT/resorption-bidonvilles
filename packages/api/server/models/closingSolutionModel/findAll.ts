import { sequelize } from '#db/sequelize';

export default () => sequelize.query(
    `SELECT
        closing_solutions.closing_solution_id AS id,
        closing_solutions.label AS label
    FROM closing_solutions`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
