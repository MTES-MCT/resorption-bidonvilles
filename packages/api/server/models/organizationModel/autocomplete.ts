import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type OrganizationAutocompleteRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    is_national: boolean,
    main_regions_names: string[],
    main_departements_names: string[],
    main_epci_names: string[],
    main_cities_names: string[],
    departements_codes: string[],
    similarity: number,
    type_name: string,
    fk_category?: string | null,
    type_abbreviation: string | null,
};

export default async (search: string, departementCode: string = null, organizationCategoryUid: string = null): Promise<OrganizationAutocompleteRow[]> => sequelize.query(
    `WITH main_territories AS (
        SELECT
            intervention_areas.fk_organization,
            array_remove(array_agg(DISTINCT cities.name), null) AS cities_names,
            array_remove(array_agg(DISTINCT epci.name), null) AS epci_names,
            array_remove(array_agg(DISTINCT departements.name), null) AS departements_names,
            array_remove(array_agg(DISTINCT regions.name), null) AS regions_names
        FROM intervention_areas
        LEFT JOIN regions ON intervention_areas.fk_region = regions.code
        LEFT JOIN departements ON intervention_areas.fk_departement = departements.code
        LEFT JOIN epci ON intervention_areas.fk_epci = epci.code
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        WHERE
                intervention_areas.fk_organization IS NOT NULL
            AND intervention_areas.is_main_area IS TRUE
        GROUP BY intervention_areas.fk_organization
    )

    SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation,
        organization_types.name_singular AS type_name,
        organization_types.abbreviation AS type_abbreviation,
        organization_types.fk_category AS fk_category,
        v_organization_areas.is_national,
        COALESCE(main_territories.regions_names, ARRAY[]::varchar[]) AS main_regions_names,
        COALESCE(main_territories.departements_names, ARRAY[]::varchar[]) AS main_departements_names,
        COALESCE(main_territories.epci_names, ARRAY[]::varchar[]) AS main_epci_names,
        COALESCE(main_territories.cities_names, ARRAY[]::varchar[]) AS main_cities_names,
        COALESCE(v_organization_areas.departements, ARRAY[]::varchar[]) AS departements_codes,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(organizations.name)),
            word_similarity(unaccent(:search), unaccent(organizations.abbreviation))
        ) AS similarity
    FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    LEFT JOIN v_organization_areas ON v_organization_areas.organization_id = organizations.organization_id AND v_organization_areas.is_main_area IS TRUE
    LEFT JOIN main_territories ON main_territories.fk_organization = organizations.organization_id
    ${departementCode !== null
        ? `
    LEFT JOIN departements ON departements.code = :departementCode
    `
        : ''
}
    WHERE
        unaccent(:search) % ANY(
            string_to_array(unaccent(organizations.name), ' ')
            ||
            string_to_array(unaccent(organizations.abbreviation), ' ')
        )
        ${organizationCategoryUid !== null ? 'AND organization_types.fk_category = :organizationCategoryUid' : ''}
        ${departementCode !== null ? `
        AND
        (v_organization_areas.is_national IS TRUE
            OR
            departements.fk_region = ANY(v_organization_areas.regions))` : ''}
    ORDER BY similarity DESC
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            search,
            departementCode,
            organizationCategoryUid,
        },
    },
);
