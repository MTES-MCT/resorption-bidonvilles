import { type Transaction } from 'sequelize';
import find from './_common/find';
import { Organization } from '#root/types/resources/Organization.d';

export default (transaction?: Transaction): Promise<Organization[]> => find({ activeOnly: true, nonEmpty: true }, transaction);
