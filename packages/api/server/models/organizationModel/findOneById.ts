import { Transaction } from 'sequelize';
import findByIds from './findByIds';
import { Organization } from '#root/types/resources/Organization.d';
import { User } from '#root/types/resources/User.d';

const findOneById = async (id: number, activeOnly: boolean = false, requestingUser?: User, transaction?: Transaction): Promise<Organization | null> => {
    const result = await findByIds([id], activeOnly, requestingUser, transaction);
    return result.length === 1 ? result[0] : null;
};

export default findOneById;
