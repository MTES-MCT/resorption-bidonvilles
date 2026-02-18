import ServiceError from '#server/errors/ServiceError';
import organizationModel from '#server/models/organizationModel/index';
import { User } from '#root/types/resources/User.d';

const ACTION_OPERATOR_TYPE = {
    id: 'action_operator_organization',
    label: 'Structure',
} as const;

interface ActionOperatorOrganizationResult {
    id: number,
    name: string,
    abbreviation: string | null,
    enriched_name: string,
    enriched_abbreviation: string | null,
    type: typeof ACTION_OPERATOR_TYPE
}

export default async function searchActionOperators(search: string, user: User): Promise<ActionOperatorOrganizationResult[]> {
    try {
        const organizations = await organizationModel.searchActionOperators(search, user);

        return organizations.map((row): ActionOperatorOrganizationResult => {
            const isCity = row.territory_type === 'city';
            const isEPCI = row.territory_type === 'epci';
            const suffix = (!isCity && !isEPCI && row.territory_name) ? ` - ${row.territory_name}` : '';

            return {
                id: row.id,
                name: row.name,
                abbreviation: row.abbreviation,
                enriched_name: `${row.name}${suffix}`,
                enriched_abbreviation: row.abbreviation ? `${row.abbreviation}${suffix}` : null,
                type: ACTION_OPERATOR_TYPE,
            };
        });
    } catch (error) {
        throw new ServiceError('db_read_error', error);
    }
}
