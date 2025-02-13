import { ActionHash } from './hashActions';
import ActionUserRow from './ActionUserRow.d';
import { ActionOrganizationMember } from '#root/types/resources/Action.d';

export default function mergeOperators(hash: ActionHash, operators: ActionUserRow[]): void {
    operators.forEach((row) => {
        const index = hash[row.action_id].operators.findIndex(({ id }) => id === row.organization_id);
        const user: ActionOrganizationMember = {
            id: row.id,
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
            position: row.position,
            phone: row.phone,
            role: row.admin_role_name || row.regular_role_name,
            is_admin: row.admin_role_name !== null,
            organization: {
                id: row.organization_id,
                name: row.organization_name,
                abbreviation: row.organization_abbreviation,
            },
        };

        if (index === -1) {
            hash[row.action_id].operators.push({
                id: row.organization_id,
                name: row.organization_name,
                abbreviation: row.organization_abbreviation,
                users: [user],
            });
        } else {
            hash[row.action_id].operators[index].users.push(user);
        }
    });
}
