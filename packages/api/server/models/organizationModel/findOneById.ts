import { Transaction } from 'sequelize';
import findByIds from './findByIds';
import { Organization } from '#root/types/resources/Organization.d';

export default async (id: number, activeOnly: boolean = false, transaction?: Transaction): Promise<Organization | null> => {
    const result = await findByIds([id], activeOnly, transaction);
    return result.length === 1 ? result[0] : null;
};
