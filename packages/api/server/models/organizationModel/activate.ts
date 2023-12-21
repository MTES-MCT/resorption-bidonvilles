import { sequelize } from '#db/sequelize';

export default async (organizationId: number): Promise<void> => {
    await sequelize.query(
        'UPDATE organizations SET active = TRUE, updated_at = NOW() WHERE organization_id = :organizationId', {
            replacements: {
                organizationId,
            },
        },
    );
};
