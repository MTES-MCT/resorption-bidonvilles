export interface Permission {
    is_writing: boolean,
    allowed: boolean,
    allow_all: boolean,
    allowed_on: null | {
        regions: string[],
        departements: string[],
        epci: string[],
        cities: string[],
        shantytowns: number[],
        plans: number[],
    },
}