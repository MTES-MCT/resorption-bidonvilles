import { Permission } from '#server/models/permissionModel/types/Permission';
import where from '#server/utils/permission/where';
import fetchActions from './fetchActions';
import fetchComments from '../fetchComments/fetchComments';
import fetchManagers from './fetchManagers';
import fetchMetrics from './fetchMetrics';
import fetchOperators from './fetchOperators';
import fetchShantytowns from './fetchShantytowns';
import fetchTopics from './fetchTopics';
import hashActions from './hashActions';
import mergeComments from './mergeComments';
import mergeManagers from './mergeManagers';
import mergeMetrics from './mergeMetrics';
import mergeOperators from './mergeOperators';
import mergeShantytowns from './mergeShantytowns';
import mergeTopics from './mergeTopics';
import Action from './Action';

export default async (actionIds: number[] = null, permission: Permission = null): Promise<Action[]> => {
    let clauseGroup = {};
    if (permission !== null) {
        clauseGroup = where()
            .can({ permissions: { action: { read: permission } } })
            .do('read', 'action');
    }

    const [actions, topics, managers, operators, shantytowns, comments, metrics] = await Promise.all([
        fetchActions(actionIds, clauseGroup),
        fetchTopics(actionIds, clauseGroup),
        fetchManagers(actionIds, clauseGroup),
        fetchOperators(actionIds, clauseGroup),
        fetchShantytowns(actionIds, clauseGroup),
        fetchComments(actionIds, null, clauseGroup),
        fetchMetrics(actionIds, clauseGroup),
    ]);

    const hash = hashActions(actions);
    mergeTopics(hash, topics);
    mergeManagers(hash, managers);
    mergeOperators(hash, operators);
    mergeShantytowns(hash, shantytowns);
    mergeComments(hash, comments);
    mergeMetrics(hash, metrics);

    return Object.values(hash);
};