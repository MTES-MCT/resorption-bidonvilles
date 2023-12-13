import { ActionHash } from './hashActions';
import ActionFinanceRow from './ActionFinanceRow.d';

export default function mergeManagers(hash: ActionHash, finances: ActionFinanceRow[]): void {
    finances.forEach((row) => {
        if (hash[row.action_id].finances[row.year] === undefined) {
            // eslint-disable-next-line no-param-reassign
            hash[row.action_id].finances[row.year] = [];
        }

        hash[row.action_id].finances[row.year].push({
            type: {
                uid: row.action_finance_type_uid,
                name: row.action_finance_type_name,
            },
            amount: row.amount,
            real_amount: row.real_amount,
            comments: row.comments,
        });
    });
}
