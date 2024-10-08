import { Transaction } from 'sequelize';

import historizeAction from './historizeAction';
import historizeFinances from './historizeFinances';
import historizeManagers from './historizeManagers';
import historizeOperators from './historizeOperators';
import historizeShantytowns from './historizeShantytowns';
import historizeTopics from './historizeTopics';

export default async (id: number, transaction: Transaction): Promise<void> => {
    // history
    const hid = await historizeAction(id, transaction);

    await Promise.all([
        historizeFinances(id, hid, transaction),
        historizeManagers(id, hid, transaction),
        historizeOperators(id, hid, transaction),
        historizeShantytowns(id, hid, transaction),
        historizeTopics(id, hid, transaction),
    ]);
};
