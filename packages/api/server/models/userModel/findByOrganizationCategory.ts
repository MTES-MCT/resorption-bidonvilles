import query from './_common/query';

export default (organizationCategoryId, geographicFilter = undefined, filters = {}, customWhere = []) => {
    const where = [
        {
            organizationCategory: {
                query: 'organization_categories.uid',
                value: [organizationCategoryId],
            },
        },
        ...customWhere,
    ];

    if (geographicFilter !== undefined) {
        if (geographicFilter.type === 'departement') {
            where.push({
                departement: {
                    query: 'organizations.departement_code',
                    value: [geographicFilter.value],
                },
            });
        } else if (geographicFilter.type === 'region') {
            where.push({
                departement: {
                    query: 'organizations.region_code',
                    value: [geographicFilter.value],
                },
            });
        }
    }

    return query(where, filters);
};
