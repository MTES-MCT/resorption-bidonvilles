import { ActionHash } from './hashActions';
import ActionUserRow from './ActionUserRow.d';
import { ActionOrganizationMember } from '#root/types/resources/Action.d';
import { User } from '#root/types/resources/User.d';

export default function mergeManagers(hash: ActionHash, managers: ActionUserRow[], requestingUser?: User): void {
    managers.forEach((row) => {
        const index = hash[row.action_id].managers.findIndex(({ id }) => id === row.organization_id);
        const canViewPhone = requestingUser?.is_superuser === true || requestingUser?.is_admin === true;
        const user: ActionOrganizationMember = {
            id: row.id,
            email: row.email,
            first_name: row.first_name,
            last_name: row.last_name,
            position: row.position,
            phone: canViewPhone ? row.phone : null,
            role: row.admin_role_name || row.regular_role_name,
            is_admin: row.admin_role_name !== null,
            organization: {
                id: row.organization_id,
                name: row.organization_name,
                abbreviation: row.organization_abbreviation,
            },
        };

        if (index === -1) {
            hash[row.action_id].managers.push({
                id: row.organization_id,
                name: row.organization_name,
                abbreviation: row.organization_abbreviation,
                users: [user],
            });
        } else {
            hash[row.action_id].managers[index].users.push(user);
        }
    });
}
