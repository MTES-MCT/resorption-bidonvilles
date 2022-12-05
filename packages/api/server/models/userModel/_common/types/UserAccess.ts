export interface UserAccess {
    id: number,
    sent_by: {
        id: number,
        first_name: string,
        last_name: string,
        position: string,
        organization: {
            id: number,
            name: string
        }
    } | null,
    used_at: number | null,
    expires_at: number,
    created_at: number
}
