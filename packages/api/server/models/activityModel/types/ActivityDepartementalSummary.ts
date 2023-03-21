interface ShantytownSummary {
    id: number,
    city: string,
    usename: string
}

interface ShantytownCommentSummary {
    id: number,
    city: string,
    shantytownId: number,
    shantytownUsename: string
}

interface UserSummary {
    name: string,
    organizationId: number
}

export interface ActivityDepartementalSummary {
    has_activity: boolean,
    code: string,
    name: string,
    new_shantytowns: Array<ShantytownSummary>,
    new_shantytowns_length: number,
    closed_shantytowns: Array<ShantytownSummary>,
    closed_shantytowns_length: number,
    updated_shantytowns: Array<ShantytownSummary>,
    updated_shantytowns_length: number,
    new_comments: Array<ShantytownCommentSummary>,
    new_comments_length: number,
    new_users: Array<UserSummary>,
    new_users_length: number,
    shantytowns_total: number,
    population_total: number
}
