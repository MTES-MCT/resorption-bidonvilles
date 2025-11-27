import { sequelize } from '#db/sequelize';
import { Transaction, QueryTypes } from 'sequelize';

export default async (transaction: Transaction = undefined): Promise<number[]> => {
    const deactivatedExpiredUsers = await sequelize.query(
        'SELECT deactivate_expired_users();',
        {
            type: QueryTypes.SELECT,
            transaction,
        },
    ) as { deactivate_expired_users: number[] }[];

    return deactivatedExpiredUsers[0].deactivate_expired_users;
};
