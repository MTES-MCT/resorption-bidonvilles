import { sequelize } from '#db/sequelize';

export default (planId, shantytowns, createdBy, transaction = undefined) => sequelize.query(
    `INSERT INTO plan_shantytowns(fk_plan, fk_shantytown, created_by)
    VALUES ${shantytowns.map(() => '(?, ?, ?)').join(', ')}`,
    {
        replacements: shantytowns.reduce((acc, id) => [
            ...acc,
            planId,
            id,
            createdBy,
        ], []),
        transaction,
    }
    ,
);
