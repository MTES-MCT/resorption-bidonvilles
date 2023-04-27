import { Permission } from '#server/models/permissionModel/types/Permission.d';
import where from '#server/utils/permission/where';
import { ShantytownAction } from '../fetch/Action';

import fetchActions from './fetchActions';
import fetchTopics from './fetchTopics';
import fetchOperators from './fetchOperators';
import hashActions from './hashActions';
import mergeTopics from './mergeTopics';
import mergeOperators from './mergeOperators';

export default async (shantytownIds: number[], permission: Permission): Promise<ShantytownAction[]> => {
    let clauseGroup = {};
    if (permission !== null) {
        clauseGroup = where()
            .can({ permissions: { action: { read: permission } } })
            .do('read', 'action');
    }

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
