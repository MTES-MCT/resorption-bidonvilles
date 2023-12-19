import { Transaction } from 'sequelize';
import where from '#server/utils/permission/where';
import fetchActions from './fetchActions';
import fetchComments from '../fetchComments/fetchComments';
import fetchFinances from './fetchFinances';
import fetchManagers from './fetchManagers';
import fetchMetrics from './fetchMetrics';
import fetchOperators from './fetchOperators';
import fetchShantytowns from './fetchShantytowns';
import fetchTopics from './fetchTopics';
import hashActions from './hashActions';
import mergeComments from './mergeComments';
import mergeFinances from './mergeFinances';
import mergeManagers from './mergeManagers';
import mergeMetrics from './mergeMetrics';
import mergeOperators from './mergeOperators';
import mergeShantytowns from './mergeShantytowns';
import mergeTopics from './mergeTopics';
import Action from '#root/types/resources/Action.d';
import { User } from '#root/types/resources/User.d';

export default async (user: User, actionIds: number[] = null, transaction?: Transaction): Promise<Action[]> => {
    const clauseGroup = where().can(user).do('read', 'action');
    if (clauseGroup === null) {
        return [];
    }

    const financeClauseGroup = where().can(user).do('access', 'action_finances');
    const [actions, topics, managers, operators, shantytowns, comments, metrics, finances] = await Promise.all([
        fetchActions(actionIds, clauseGroup, transaction),
        fetchTopics(actionIds, clauseGroup, transaction),
        fetchManagers(actionIds, clauseGroup, transaction),
        fetchOperators(actionIds, clauseGroup, transaction),
        fetchShantytowns(actionIds, clauseGroup, transaction),
        fetchComments(actionIds, null, clauseGroup, transaction),
        fetchMetrics(actionIds, clauseGroup, transaction),
        financeClauseGroup !== null ? fetchFinances(actionIds, clauseGroup, financeClauseGroup, transaction) : [],
    ]);

    const hash = hashActions(actions);
    mergeTopics(hash, topics);
    mergeManagers(hash, managers);
    mergeOperators(hash, operators);
    mergeShantytowns(hash, shantytowns);
    mergeComments(hash, comments);
    mergeMetrics(hash, metrics);
    mergeFinances(hash, finances);

    return Object.values(hash);
};
