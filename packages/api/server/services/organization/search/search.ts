import ServiceError from '#server/errors/ServiceError';
import userModel from '#server/models/userModel/index';
import organizationModel from '#server/models/organizationModel/index';
import formatName from '#server/models/userModel/_common/formatName';

interface AutocompleteResult {
    id: number,
    label: string,
    similarity: number,
}

interface UserAutocompleteResult extends AutocompleteResult {
    organization: number,
    type: {
        id: 'user',
        label: 'Acteurs'
    }
}

interface OrganizationAutocompleteResult extends AutocompleteResult {
    type: {
        id: 'organization',
        label: 'Structures'
    }
}
type SearchResponseItem = UserAutocompleteResult | OrganizationAutocompleteResult;

export default async (search: string, departementCode: string = null, usersOnly: boolean = false): Promise<SearchResponseItem[]> => {
    try {
        const [users, organizations] = await Promise.all([
            userModel.autocomplete(search, departementCode),
            usersOnly ? [] : organizationModel.autocomplete(search, departementCode),
        ]);

        const serializedUsers = users.map((row): UserAutocompleteResult => ({
            id: row.id,
            label: `${formatName(row)} (${row.organization_abbreviation || row.organization_name})`,
            organization: row.organization_id,
            type: {
                id: 'user',
                label: 'Acteurs',
            },
            similarity: row.similarity,
        }));
        const serializedOrganizations = organizations.map((row): OrganizationAutocompleteResult => ({
            id: row.id,
            label: row.abbreviation ?? row.name,
            type: {
                id: 'organization',
                label: 'Structures',
            },
            similarity: row.similarity,
        }));

        return [...serializedUsers, ...serializedOrganizations].sort((a, b) => {
            if (a.similarity === b.similarity) {
                return 0;
            }

            return a.similarity > b.similarity ? -1 : 1;
        }).slice(0, 10);
    } catch (error) {
        throw new ServiceError('db_read_error', error);
    }
};
