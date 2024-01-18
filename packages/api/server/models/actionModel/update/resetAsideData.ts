import { Transaction } from 'sequelize';

import resetFinances from './resetFinances';
import resetManagers from './resetManagers';
import resetOperators from './resetOperators';
import resetShantytowns from './resetShantytowns';
import resetTopics from './resetTopics';

export default async (id: number, transaction: Transaction): Promise<void> => {
    await Promise.all([
        resetManagers(id, transaction),
        resetOperators(id, transaction),
        resetShantytowns(id, transaction),
        resetTopics(id, transaction),
        resetFinances(id, transaction),
    ]);
};
