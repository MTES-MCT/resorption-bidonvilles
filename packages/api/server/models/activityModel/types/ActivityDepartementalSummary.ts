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
    closed_shantytowns: Array<ShantytownSummary>,
    updated_shantytowns: Array<ShantytownSummary>,
    new_comments: Array<ShantytownCommentSummary>,
    new_users: Array<UserSummary>,
    shantytowns_total: number,
    population_total: number
}
