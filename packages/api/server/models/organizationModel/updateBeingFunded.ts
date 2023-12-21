import { sequelize } from '#db/sequelize';

type BeingFundedData = {
    being_funded: boolean;
    being_funded_at: Date;
};

export default async (organizationId: number, data: BeingFundedData): Promise<void> => {
    await sequelize.query(
        `UPDATE
            organizations
        SET
            being_funded = :being_funded,
            being_funded_at = :being_funded_at,
            updated_at = NOW()
        WHERE
            organizations.organization_id = :organizationId`,
        {
            replacements: {
                ...data,
                organizationId,
            },
        },
    );
};
