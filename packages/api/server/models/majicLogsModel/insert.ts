import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (fk_user: number, fk_organization: number, fk_parcel: string, transaction: Transaction = undefined): Promise<number> => {
    const response: any = await sequelize.query(
        `INSERT INTO
            land_registry_enquiries (
                fk_user,
                fk_organization,
                fk_parcel,
                created_at
            )
            VALUES (
                :fk_user,
                :fk_organization,
                :fk_parcel,
                CURRENT_TIMESTAMP
            )
            RETURNING enquiry_id`,
        {
            replacements: {
                fk_user,
                fk_organization,
                fk_parcel,
            },
            transaction,
        },
    );

    return response[0][0].enquiry_id;
};
