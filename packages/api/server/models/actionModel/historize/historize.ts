import { Transaction } from 'sequelize';

import historizeAction from './historizeAction';
import historizeAddresses from './historizeAddresses';
import historizeFinances from './historizeFinances';
import historizeManagers from './historizeManagers';
import historizeMetrics from './historizeMetrics';
import historizeOperators from './historizeOperators';
import historizeShantytowns from './historizeShantytowns';
import historizeTopics from './historizeTopics';

export default async function historize(id: number, transaction: Transaction): Promise<void> {
    // history
    const hid = await historizeAction(id, transaction);

    await Promise.all([
        historizeAddresses(id, hid, transaction),
        historizeFinances(id, hid, transaction),
        historizeManagers(id, hid, transaction),
        historizeMetrics(id, hid, transaction),
        historizeOperators(id, hid, transaction),
        historizeShantytowns(id, hid, transaction),
        historizeTopics(id, hid, transaction),
    ]);
}
