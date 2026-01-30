import ServiceError from '#server/errors/ServiceError';
import organizationModel from '#server/models/organizationModel/index';
import { User } from '#root/types/resources/User.d';

interface ActionOperatorOrganizationResult {
    id: number,
    name: string,
    abbreviation: string | null,
    enriched_name: string,
    enriched_abbreviation: string | null,
    actionCount: number,
    type: {
        id: 'action_operator_organization',
        label: 'Structure'
    }
}

export default async function searchActionOperators(search: string, user: User): Promise<ActionOperatorOrganizationResult[]> {
    try {
        const organizations = await organizationModel.searchActionOperators(search, user);

        return organizations.map((row): ActionOperatorOrganizationResult => ({
            id: row.id,
            name: row.name,
            abbreviation: row.abbreviation,
            enriched_name: row.enriched_name,
            enriched_abbreviation: row.enriched_abbreviation,
            actionCount: Number(row.action_count),
            type: {
                id: 'action_operator_organization',
                label: 'Structure',
            },
        }));
    } catch (error) {
        throw new ServiceError('db_read_error', error);
    }
}
