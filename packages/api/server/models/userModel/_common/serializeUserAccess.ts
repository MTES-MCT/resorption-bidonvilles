type RawUserAccess = {
    user_access_id: number,
    activator_id: number | null,
    activator_email: string | null,
    activator_first_name: string | null,
    activator_last_name: string | null,
    activator_position: string | null,
    activator_organization_id: number | null,
    activator_organization_name: string | null,
    user_access_used_at: Date | null,
    user_access_expires_at: Date,
    user_access_created_at: Date,
};

export type SerializedUserAccess = {
    id: number,
    sent_by: {
        id: number,
        email: string,
        first_name: string,
        last_name: string,
        position: string | null,
        organization: {
            id: number,
            name: string,
        },
    } | null,
    used_at: number | null,
    expires_at: number,
    created_at: number,
};

export default (userAccess: RawUserAccess): SerializedUserAccess => ({
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
});
