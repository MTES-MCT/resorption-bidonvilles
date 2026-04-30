import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type ShantytownClosingSolution = {
    shantytownId: number,
    id: number,
    peopleAffected: number,
    householdsAffected: number,
    message: string,
};

export default function findByShantytown(shantytownIds: string[]): Promise<ShantytownClosingSolution[]> {
    return sequelize.query(
        `SELECT
                shantytown_closing_solutions.fk_shantytown AS "shantytownId",
                closing_solutions.closing_solution_id AS "id",
                shantytown_closing_solutions.number_of_people_affected AS "peopleAffected",
                shantytown_closing_solutions.number_of_households_affected AS "householdsAffected",
                shantytown_closing_solutions.message AS "message"
            FROM shantytown_closing_solutions
            LEFT JOIN closing_solutions ON shantytown_closing_solutions.fk_closing_solution = closing_solutions.closing_solution_id
            WHERE shantytown_closing_solutions.fk_shantytown IN (:ids)`,
        {
            type: QueryTypes.SELECT,
            replacements: { ids: shantytownIds },
        },
    );
}
