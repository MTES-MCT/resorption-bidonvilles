import { Where } from '#server/models/_common/types/Where';
import { AuthUser } from '#server/middlewares/authMiddleware';
import query from './_common/query';

export default (user: AuthUser, filters: Where = [], feature: string = 'list', order = ['shantytowns.updated_at DESC']) => query(user, feature, filters, order);
