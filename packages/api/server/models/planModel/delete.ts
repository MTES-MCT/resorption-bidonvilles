const sequelize = require('#db/sequelize');

module.exports = planId => sequelize.query(
    'DELETE FROM plans WHERE plan_id = :planId',
    {
        replacements: {
            planId,
        },
    },
);
