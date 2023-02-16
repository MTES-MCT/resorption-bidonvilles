import { Transaction } from 'sequelize';

import resetManagers from './resetManagers';
import resetOperators from './resetOperators';
import resetPermissions from './resetPermissions';
import resetShantytowns from './resetShantytowns';
import resetTopics from './resetTopics';

export default async (id: number, transaction: Transaction): Promise<void> => {
    await resetPermissions(id, transaction);

    await Promise.all([
        resetManagers(id, transaction),
        resetOperators(id, transaction),
        resetShantytowns(id, transaction),
        resetTopics(id, transaction),
    ]);
};
