import { sequelize } from '#db/sequelize';

export default async (organizationId, data) => {
    const transaction = await sequelize.transaction();
    try {
        await sequelize.query(
            `UPDATE
                organizations
            SET
                being_funded = :being_funded,
                being_funded_at = :being_funded_at
            WHERE
                organizations.organization_id = ${organizationId}`,
            {
                transaction,
                replacements: data,
            },
        );

        await sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            {
                transaction,
            },
        );
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
