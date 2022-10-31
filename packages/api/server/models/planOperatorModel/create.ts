import { sequelize } from '#db/sequelize';

export default (planId, userId, createdBy, transaction = undefined) => sequelize.query(
    `INSERT INTO plan_operators(fk_plan, fk_user, created_by)
    VALUES (:planId, :userId, :createdBy)`,
    {
        replacements: {
            planId,
            userId,
            createdBy,
        },
        transaction,
    },
);
