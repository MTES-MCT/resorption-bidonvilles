module.exports = database => ({
    findByCategory: (categoryUid, withTotalOfOrganizations = false) => {
        const columns = {
            'organization_types.organization_type_id': 'id',
            'organization_types.name_singular': 'name_singular',
            'organization_types.name_plural': 'name_plural',
            'organization_types.abbreviation': 'abbreviation',
            'organization_types.fk_category': 'organization_category',
        };

        if (withTotalOfOrganizations) {
            columns['COUNT(organizations.organization_id)'] = 'numberOfOrganizations';
        }

        return database.query(
            `SELECT
                ${Object.keys(columns).map(column => `${column} AS "${columns[column]}"`).join(', ')}
            FROM organization_types
            ${withTotalOfOrganizations ? 'LEFT JOIN organizations ON organizations.fk_type = organization_types.organization_type_id' : ''}
            WHERE organization_types.fk_category = :categoryUid
            ${withTotalOfOrganizations ? 'GROUP BY organization_types.organization_type_id' : ''}
            ORDER BY organization_types.name_singular`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    categoryUid,
                },
            },
        );
    },

    findOneById: async (id) => {
        const result = await database.query(
            `SELECT
                organization_type_id AS id,
                name_singular,
                name_plural,
                abbreviation,
                fk_category AS organization_category
            FROM organization_types
            WHERE organization_type_id = :id`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    id,
                },
            },
        );

        return result.length === 1 ? result[0] : null;
    },
});
