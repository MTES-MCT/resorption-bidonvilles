import { sequelize } from '#db/sequelize';

export default (planId, transaction = undefined) => {
    sequelize.query(
        'DELETE FROM finances WHERE fk_plan = :planId',
        {
            replacements: { planId },
            transaction,
        },
    );
};
