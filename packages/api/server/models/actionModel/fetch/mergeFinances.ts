import { ActionHash } from './hashActions';
import ActionFinanceRow from './ActionFinanceRow.d';

export default function mergeFinances(hash: ActionHash, finances: ActionFinanceRow[]): void {
    finances.forEach((row) => {
        const action = hash[row.action_id];
        if (action === undefined) {
            return;
        }

        // eslint-disable-next-line no-param-reassign
        action.finances ??= {};

        const actionFinances = action.finances;
        actionFinances[row.year] ??= [];

        actionFinances[row.year].push({
            type: {
                uid: row.action_finance_type_uid,
                name: row.action_finance_type_name,
            },
            amount: row.amount,
            real_amount: row.real_amount,
            comments: row.comments,
        });

        if (row.action_finance_type_uid === 'dedie') {
            // eslint-disable-next-line no-param-reassign
            action.hasDihalFinancing = true;
            const currentYear = action.dihalFinancingYear;
            if (currentYear === null || row.year > currentYear) {
                // eslint-disable-next-line no-param-reassign
                action.dihalFinancingYear = row.year;
            }
        }
    });
}
