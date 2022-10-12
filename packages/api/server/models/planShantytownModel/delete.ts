const sequelize = require('#db/sequelize');

module.exports = (planId, transaction = undefined) => {
    sequelize.query(
        'DELETE FROM plan_shantytowns WHERE fk_plan = :planId',
        {
            replacements: { planId },
            transaction,
        },
    );
};
