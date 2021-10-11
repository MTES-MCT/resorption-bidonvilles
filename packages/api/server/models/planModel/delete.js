const { sequelize } = require('#db/models');

module.exports = planId => sequelize.query(
    'DELETE FROM plans WHERE plan_id = :planId',
    {
        replacements: {
            planId,
        },
    },
);
