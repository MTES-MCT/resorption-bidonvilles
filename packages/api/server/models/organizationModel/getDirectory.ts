import { type Transaction } from 'sequelize';
import find from './_common/find';
import { Organization } from '#root/types/resources/Organization.d';
import { User } from '#root/types/resources/User.d';

export default (requestingUser?: User, transaction?: Transaction): Promise<Organization[]> => find({ activeOnly: true, nonEmpty: true }, requestingUser, transaction);
