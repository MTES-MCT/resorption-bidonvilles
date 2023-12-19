import where from '#server/utils/permission/where';
import { ShantytownAction } from '#root/types/resources/Action.d';

import fetchActions from './fetchActions';
import fetchTopics from './fetchTopics';
import fetchOperators from './fetchOperators';
import hashActions from './hashActions';
import mergeTopics from './mergeTopics';
import mergeOperators from './mergeOperators';
import { User } from '#root/types/resources/User.d';

export default async (user: User, shantytownIds: number[]): Promise<ShantytownAction[]> => {
    const clauseGroup = where().can(user).do('read', 'action');
    const [actions, topics, operators] = await Promise.all([
        fetchActions(shantytownIds, clauseGroup),
        fetchTopics(shantytownIds, clauseGroup),
        fetchOperators(shantytownIds, clauseGroup),
    ]);

    const hash = hashActions(actions);
    mergeTopics(hash, topics);
    mergeOperators(hash, operators);

    return Object.values(hash);
};
