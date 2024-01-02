import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (organizationId: number, transaction?: Transaction): Promise<void> => {
    await sequelize.query(
        'UPDATE organizations SET active = TRUE, updated_at = NOW() WHERE organization_id = :organizationId', {
            replacements: {
                organizationId,
            },
            transaction,
        },
    );
};
