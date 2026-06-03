import { ActionInput } from '#server/services/action/ActionInput.d';

export type ActionInputOperator = {
    id: number,
    organization_id: number,
    is_principal?: boolean,
};

export function buildActionData(
    operators: ActionInputOperator[],
    override: Partial<ActionInput> = {},
): ActionInput {
    const defaultData: ActionInput = {
        name: 'Action test',
        started_at: new Date(2024, 0, 1),
        ended_at: null,
        topics: ['health'],
        goals: 'Objectif test',
        location: {
            type: 'departement' as const,
            city: null,
            epci: null,
            departement: { code: '78', name: 'Yvelines' },
            region: { code: '11', name: 'Île-De-France' },
        },
        location_departement: '78',
        location_type: 'logement' as const,
        location_eti_addresses: null,
        location_shantytowns: null,
        location_autre: null,
        managers: [{ id: 1, organization_id: 10 }],
        operators,
        indicateurs: {},
    };

    return Object.assign(defaultData, override);
}

export default buildActionData;
