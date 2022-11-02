import { sequelize } from '#db/sequelize';

export default (shantytownId, closedWithSolutions) => {
    sequelize.query(
        `UPDATE shantytowns
        SET 
            closed_with_solutions = :closed_with_solutions
        WHERE shantytown_id = :id`,
        {
            replacements: {
                id: shantytownId,
                closed_with_solutions: closedWithSolutions,
            },

        },
    );
};
