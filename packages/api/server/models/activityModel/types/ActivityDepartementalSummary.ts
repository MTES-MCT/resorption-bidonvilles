interface ShantytownSummary {
    id: number,
    usename: string
}

interface ShantytownCommentSummary {
    id: number,
    shantytownId: number,
    shantytownUsename: string
}

interface UserSummary {
    name: string,
    organizationId: number
}

export interface ActivityDepartementalSummary {
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