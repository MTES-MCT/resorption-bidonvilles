const sequelize = require('#db/sequelize');

module.exports = (planId, managerIds, creatorId, transaction = undefined) => sequelize.bulkInsert(
    'plan_managers',
    managerIds.map(id => ({
        fk_plan: planId,
        fk_user: id,
        created_by: creatorId,
    })),
    { transaction },
);
