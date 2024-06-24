import { UserAccess } from '#root/types/resources/User.d';
import { RawUserAccess } from './query.d';

export default (userAccess: RawUserAccess): UserAccess => ({
    id: userAccess.user_access_id,
    sent_by: userAccess.activator_id !== null ? {
        id: userAccess.activator_id,
        email: userAccess.activator_email,
        first_name: userAccess.activator_first_name,
        last_name: userAccess.activator_last_name,
        position: userAccess.activator_position,
        organization: {
            id: userAccess.activator_organization_id,
            name: userAccess.activator_organization_name,
        },
    } : null,
    used_at: userAccess.user_access_used_at ? userAccess.user_access_used_at.getTime() / 1000 : null,
    expires_at: userAccess.user_access_expires_at.getTime() / 1000,
    created_at: userAccess.user_access_created_at.getTime() / 1000,
    refused_at: userAccess.user_access_refused_at ? userAccess.user_access_refused_at.getTime() / 1000 : null,
});
