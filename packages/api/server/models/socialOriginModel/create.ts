import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (shantytown_id: number, social_origin_ids: number[], transaction: Transaction = undefined): Promise<void> => {
    await sequelize.getQueryInterface().bulkInsert(
        'shantytown_origins',
        social_origin_ids.map(social_origin_id => ({
            fk_shantytown: shantytown_id,
            fk_social_origin: social_origin_id,
        })),
        {
            transaction,
        },
    );
};
