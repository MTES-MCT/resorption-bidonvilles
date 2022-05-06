import { sequelize } from '#db/sequelize';

export default typeId => sequelize.query(
    `SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation,
        organizations.location_type,
        organizations."region_code",
        organizations."region_name",
        organizations."departement_code",
        organizations."departement_name",
        organizations."epci_code",
        organizations."epci_name",
        organizations."city_code",
        organizations."city_name"
    FROM localized_organizations AS organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    WHERE
        organizations.fk_type = :typeId
    ORDER BY
        CASE organization_types.fk_category
            WHEN 'association' THEN organizations.name
            ELSE '' END
        ASC,
        departement_code ASC, REPLACE(region_name, 'Î', 'I') ASC, epci_name ASC, city_name ASC`,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            typeId,
        },
    },
);
