import { sequelize } from '#db/sequelize';

export default (planId, managerIds, creatorId, transaction = undefined) => sequelize.getQueryInterface().bulkInsert(
    'plan_managers',
    managerIds.map(id => ({
        fk_plan: planId,
        fk_user: id,
        created_by: creatorId,
    })),
    { transaction },
);
