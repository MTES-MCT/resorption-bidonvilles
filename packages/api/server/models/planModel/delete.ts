import { sequelize } from '#db/sequelize';

export default planId => sequelize.query(
    'DELETE FROM plans WHERE plan_id = :planId',
    {
        replacements: {
            planId,
        },
    },
);
