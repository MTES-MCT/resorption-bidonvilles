import { ActionInput, ActionOperatorInput } from '#server/services/action/ActionInput.d';

export function buildActionData(
    operators: ActionOperatorInput[],
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
