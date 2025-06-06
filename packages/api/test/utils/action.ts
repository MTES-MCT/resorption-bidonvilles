import Action from '#root/types/resources/Action.d';

export function serialized(override = {}): Action {
    const action: Action = {
        type: 'action',
        id: 1,
        name: 'Une action',
        started_at: (new Date(2023, 0, 1)).getTime(),
        ended_at: null,
        goals: 'Un objectif',
        topics: [{ uid: 'health', name: 'Santé' }],
        location: {
            type: 'departement',
            city: null,
            epci: null,
            departement: {
                code: '78',
                name: 'Yvelines',
            },
            region: {
                code: '11',
                name: 'Île-De-France',
            },
        },
        location_type: 'logement',
        eti: null,
        location_other: null,
        location_shantytowns: [],
        managers: [
            {
                id: 1,
                name: 'Structure',
                abbreviation: null,
                users: [
                    {
                        id: 1,
                        email: 'jean@dupont.fr',
                        position: 'Chef de service',
                        phone: '01 02 03 04 05',
                        role: 'collaborator',
                        is_admin: false,
                        first_name: 'Jean',
                        last_name: 'Dupont',
                        organization: {
                            id: 1,
                            name: 'Structure',
                            abbreviation: null,
                        },
                    },
                ],
            },
        ],
        operators: [
            {
                id: 2,
                name: 'Opérateur',
                abbreviation: null,
                users: [
                    {
                        id: 2,
                        email: 'jean@dupont.fr',
                        position: 'Chef de service',
                        phone: '01 02 03 04 05',
                        role: 'collaborator',
                        is_admin: false,
                        first_name: 'Jean',
                        last_name: 'Dupont',
                        organization: {
                            id: 2,
                            name: 'Structure',
                            abbreviation: null,
                        },
                    },
                ],
            },
        ],
        metrics: [],
        comments: [
            {
                attachments: [],
                createdAt: (new Date(2022, 0, 1)).getTime(),
                createdBy: {
                    id: 1,
                    first_name: 'Jean',
                    last_name: 'Dupont',
                    organization: 'structure',
                    organization_id: 1,
                },
                description: 'Un commentaire',
                id: 1,
            },
        ],
        created_at: (new Date(2022, 0, 1)).getTime(),
        created_by: {
            id: 1,
            first_name: 'Jean',
            last_name: 'Dupont',
            organization: {
                id: 1,
                name: 'Structure',
                abbreviation: null,
            },
        },
        updated_at: null,
        updated_by: null,
    };

    return Object.assign(action, override);
}

export default serialized;
