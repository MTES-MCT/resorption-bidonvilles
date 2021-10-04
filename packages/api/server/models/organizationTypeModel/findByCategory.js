const { sequelize } = require('#db/models');

module.exports = (categoryUid, withTotalOfOrganizations = false) => {
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

    return sequelize.query(
        `SELECT
            ${Object.keys(columns).map(column => `${column} AS "${columns[column]}"`).join(', ')}
        FROM organization_types
        ${withTotalOfOrganizations ? 'LEFT JOIN organizations ON organizations.fk_type = organization_types.organization_type_id' : ''}
        WHERE organization_types.fk_category = :categoryUid
        ${withTotalOfOrganizations ? 'GROUP BY organization_types.organization_type_id' : ''}
        ORDER BY organization_types.name_singular`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                categoryUid,
            },
        },
    );
};
