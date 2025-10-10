import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import query from './_common/query';

export default async function findOne(user: AuthUser, shantytownId: number, feature = 'read') {
    let towns: Shantytown[] = [];
    towns = await query(
        user,
        feature,
        [{ shantytown_id: { value: shantytownId } }],
        undefined,
        true, // include changelog
    );
    return towns.length === 1 ? towns[0] : null;
}
