import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { ClosingSolution } from '#root/types/resources/ClosingSolution.d';

export default (): Promise<ClosingSolution[]> => sequelize.query(
    `SELECT
        closing_solutions.closing_solution_id AS id,
        closing_solutions.label AS label
    FROM closing_solutions ORDER BY closing_solutions.order ASC;`,
    {
        type: QueryTypes.SELECT,
    },
);
