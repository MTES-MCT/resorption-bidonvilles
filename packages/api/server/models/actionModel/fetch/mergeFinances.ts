import { ActionHash } from './hashActions';
import ActionFinanceRow from './ActionFinanceRow.d';

export default function mergeManagers(hash: ActionHash, finances: ActionFinanceRow[]): void {
    finances.forEach((row) => {
        const action = hash[row.action_id];
        if (action === undefined) {
            return;
        }

        if (action.finances === undefined) {
            // eslint-disable-next-line no-param-reassign
            action.finances = {};
        }

        const finances = action.finances;
        if (finances[row.year] === undefined) {
            finances[row.year] = [];
        }

        finances[row.year]!.push({
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
