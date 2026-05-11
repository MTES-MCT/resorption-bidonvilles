import { Where } from '#server/models/_common/types/Where.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import query from './_common/query';

export default async function findAll(user: AuthUser, filters: Where = [], feature: string = 'list', order = ['shantytowns.updated_at DESC']) {
    return query(user, feature, filters, order);
}
