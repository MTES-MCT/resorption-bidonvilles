import { Transaction } from 'sequelize';

import resetAddresses from './resetAddresses';
import resetFinances from './resetFinances';
import resetManagers from './resetManagers';
import resetMetrics from './resetMetrics';
import resetOperators from './resetOperators';
import resetShantytowns from './resetShantytowns';
import resetTopics from './resetTopics';

export default async function resetAsideData(id: number, canWriteFinances: boolean, transaction: Transaction): Promise<void> {
    const promises = [
        resetAddresses(id, transaction),
        resetManagers(id, transaction),
        resetMetrics(id, transaction),
        resetOperators(id, transaction),
        resetShantytowns(id, transaction),
        resetTopics(id, transaction),
    ];

    if (canWriteFinances) {
        promises.push(resetFinances(id, transaction));
    }

    await Promise.all(promises);
}
