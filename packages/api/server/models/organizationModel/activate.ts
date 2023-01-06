import { sequelize } from '#db/sequelize';

export default async (organizationId, argTransaction = undefined) => {
    let transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }

    try {
        const response = await sequelize.query('UPDATE organizations SET active = TRUE WHERE organization_id = :organizationId', {
            replacements: {
                organizationId,
            },
            transaction,
        });
        await sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations',
            {
                transaction,
            });

        if (argTransaction === undefined) {
            await transaction.commit();
        }

        return response;
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }

        throw error;
    }
};
