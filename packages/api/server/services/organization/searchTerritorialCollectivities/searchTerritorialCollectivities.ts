import ServiceError from '#server/errors/ServiceError';
import organizationModel from '#server/models/organizationModel/index';

type OrganizationAutocompleteResult = {
    id: number,
    label: string
    type: string,
    similarity: number,
};

export default async (search: string): Promise<OrganizationAutocompleteResult[]> => {
    try {
        const organizations = await organizationModel.autocomplete(search, null, 'territorial_collectivity');

        return Object.values(
            organizations.reduce((acc, row) => {
                acc[row.type_name] ??= [];

                if (acc[row.type_name].length < 5 && row.similarity >= 0.8) {
                    const dep = row.departements_codes.length === 1 ? ` (${row.departements_codes.join(', ')})` : '';

                    acc[row.type_name].push({
                        id: row.id,
                        label: `${row.abbreviation || row.name}${dep}`,
                        type: row.type_name,
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
