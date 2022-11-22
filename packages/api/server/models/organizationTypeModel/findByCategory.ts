import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (categoryUid, withTotalOfOrganizations = false) => {
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

    const rows = await sequelize.query(
        `SELECT
            ${Object.keys(columns).map(column => `${column} AS "${columns[column]}"`).join(', ')}
        FROM organization_types
        ${withTotalOfOrganizations ? 'LEFT JOIN organizations ON organizations.fk_type = organization_types.organization_type_id' : ''}
        WHERE organization_types.fk_category = :categoryUid
        ${withTotalOfOrganizations ? 'GROUP BY organization_types.organization_type_id' : ''}
        ORDER BY UNACCENT(organization_types.name_singular)`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                categoryUid,
            },
        },
    );

    // eslint-disable-next-line no-param-reassign
    rows.forEach((row: any) => { row.numberOfOrganizations = parseInt(row.numberOfOrganizations, 10); });
    return rows;
};
