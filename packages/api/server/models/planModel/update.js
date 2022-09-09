const sequelize = require('#db/sequelize');

module.exports = (data, userId, transaction = undefined) => {
    sequelize.query(
        `UPDATE plans2 SET
        name = :name,
        started_at = :startedAt,
        expected_to_end_at = :expectedToEndAt,
        goals = :goals,
        updated_by = :updatedBy,
        updated_at = :updatedAt 
    WHERE
        plan_id = :planId`,
        {
            replacements: {
                name: data.name,
                startedAt: data.startedAt,
                expectedToEndAt: data.expectedToEndAt,
                goals: data.goals,
                updatedAt: new Date(),
                updatedBy: userId,
                planId: data.planId,
            },
            transaction,
        },
    );
};
