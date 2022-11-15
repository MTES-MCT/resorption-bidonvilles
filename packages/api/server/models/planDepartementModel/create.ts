import { sequelize } from '#db/sequelize';

export default (planId, departementId, createdBy, transaction = undefined) => sequelize.query(
    `INSERT INTO plan_departements(fk_plan, fk_departement, created_by)
        VALUES(:plan_id, :departement_id, :user_id)
        RETURNING fk_plan AS id`,
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
