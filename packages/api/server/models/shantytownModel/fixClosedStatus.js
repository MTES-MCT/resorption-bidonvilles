const sequelize = require('#db/sequelize');

module.exports = async (shantytownId, closedWithSolutions) => {
    await sequelize.query(
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
