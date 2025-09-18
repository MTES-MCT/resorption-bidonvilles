import ServiceError from '#server/errors/ServiceError';
import autocomplete from '#server/models/organizationModel/autocomplete';

type OrganizationAutocompleteResult = {
    id: number,
    label: string
    name: string,
    type: string,
    category: string,
    abbreviation?: string,
    similarity: number,
    fk_category?: string | null
    type_abbreviation?: string | null
    organization_type_id: number,
};

export default async (search: string): Promise<OrganizationAutocompleteResult[]> => {
    try {
        const organizations = await autocomplete(search, null, null);

        return Object.values(
            organizations.reduce((acc, row) => {
                if (acc[row.type_name] === undefined) {
                    acc[row.type_name] = [];
                }

                if (row.similarity >= 0.75) {
                    let territory;
                    if (row.is_national === true) {
                        territory = 'National';
                    } else {
                        territory = row.main_regions_names
                            .concat(row.main_departements_names)
                            .concat(row.main_epci_names)
                            .concat(row.main_cities_names)
                            .join(', ');
                    }

                    acc[row.type_name].push({
                        id: row.id,
                        label: territory,
                        name: row.name,
                        abbreviation: row.abbreviation,
                        type: row.type_name,
                        category: row.fk_category,
                        similarity: row.similarity,
                        type_abbreviation: row.type_abbreviation,
                        organization_type_id: row.organization_type_id,
                    });
                }

                return acc;
            }, {} as Record<string, OrganizationAutocompleteResult[]>),
        ).flat();
    } catch (error) {
        throw new ServiceError('db_read_error', error);
    }
};
