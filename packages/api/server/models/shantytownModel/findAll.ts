import { Where } from '#server/models/_common/types/Where';
import { User } from '#root/types/resources/User.d';
import query from './_common/query';

export default (user: User, filters: Where = [], feature: string = 'list', order = ['shantytowns.updated_at DESC']) => query(user, feature, filters, order);
