import { type Transaction } from 'sequelize';
import find from './_common/find';
import { Organization } from '#root/types/resources/Organization.d';
import { User } from '#root/types/resources/User.d';

export default (ids: number[], activeOnly: boolean = false, requestingUser?: User, transaction?: Transaction): Promise<Organization[]> => find({ ids, activeOnly }, requestingUser, transaction);
