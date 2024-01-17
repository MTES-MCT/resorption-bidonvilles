import ServiceError from '#server/errors/ServiceError';
import autocomplete from '#server/models/organizationModel/autocomplete';

type OrganizationAutocompleteResult = {
    id: number,
    label: string
    name: string,
    similarity: number,
};

export default async (search: string): Promise<OrganizationAutocompleteResult[]> => {
    try {
        const organizations = await autocomplete(search, null, 'association');

        return Object.values(
            organizations.reduce((acc, row) => {
                if (acc[row.type_name] === undefined) {
                    acc[row.type_name] = [];
                }

                if (row.similarity >= 0.85) {
                    let territory;
                    if (row.is_national === true) {
                        territory = 'National';
                    } else {
                        territory = row.main_departements_names.concat(row.main_regions_names).join(', ');
                    }

                    acc[row.type_name].push({
                        id: row.id,
                        label: territory,
                        name: row.abbreviation || row.name,
                        similarity: row.similarity,
                    });
                }

                return acc;
            }, {} as Record<string, OrganizationAutocompleteResult[]>),
        ).flat();
    } catch (error) {
        throw new ServiceError('db_read_error', error);
    }
};
