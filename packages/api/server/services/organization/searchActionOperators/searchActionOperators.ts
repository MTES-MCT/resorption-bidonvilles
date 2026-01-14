import ServiceError from '#server/errors/ServiceError';
import organizationModel from '#server/models/organizationModel/index';

interface ActionOperatorOrganizationResult {
    id: number,
    name: string,
    abbreviation: string | null,
    actionCount: number,
    type: {
        id: 'action_operator_organization',
        label: 'Structure'
    }
}

export default async (search: string): Promise<ActionOperatorOrganizationResult[]> => {
    try {
        const organizations = await organizationModel.searchActionOperators(search);

        return organizations.map((row): ActionOperatorOrganizationResult => ({
            id: row.id,
            name: row.name,
            abbreviation: row.abbreviation,
            actionCount: Number(row.action_count),
            type: {
                id: 'action_operator_organization',
                label: 'Structure',
            },
        }));
    } catch (error) {
        throw new ServiceError('db_read_error', error);
    }
};
