type ActionTopic = {
    uid: string,
    name: string
};

type ActionOrganization = {
    id: number,
    name: string,
    abbreviation: string | null,
    users: ActionOrganizationMember[]
};

type ActionOrganizationMember = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    position: string,
    phone: string | null,
    role: string,
    is_admin: boolean,
    organization: {
        id: number
    }
};

export type EnrichedAction = {
    id: number,
    name: string,
    topics: ActionTopic[],
    operators: ActionOrganization[],
    location: {
        type: 'departement',
        city: null,
        epci: null,
        departement: {
            code: string,
            name: string
        },
        region: {
            code: string,
            name: string,
        }
    }
};
