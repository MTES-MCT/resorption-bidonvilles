import { Transaction } from 'sequelize';
import findByIds from './findByIds';
import { Organization } from '#root/types/resources/Organization.d';

export default async (id: number, transaction?: Transaction): Promise<Organization | null> => {
    const result = await findByIds([id], transaction);
    return result.length === 1 ? result[0] : null;
};
