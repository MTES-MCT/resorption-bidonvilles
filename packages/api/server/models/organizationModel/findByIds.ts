import { type Transaction } from 'sequelize';
import find from './_common/find';
import { Organization } from '#root/types/resources/Organization.d';

export default (ids: number[], transaction?: Transaction): Promise<Organization[]> => find({ ids }, transaction);
