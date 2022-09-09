const sequelize = require('#db/sequelize');

module.exports = (planId, departementId, createdBy, transaction = undefined) => sequelize.query(
    `INSERT INTO plan_departement(fk_plan, fk_departement, created_by)
        VALUES(plan_id, :departement_id, :user_id)
        RETURNING plan_id AS id`,
    {
        replacements:
            {
                plan_id: planId,
                departement_id: departementId,
                user_id: createdBy,
            },
        transaction,
    },
);
