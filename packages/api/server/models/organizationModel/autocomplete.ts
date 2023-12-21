import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type OrganizationAutocompleteRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    similarity: number,
};

export default async (search: string, departementCode: string = null): Promise<OrganizationAutocompleteRow[]> => sequelize.query(
    `WITH organization_regions AS (
        SELECT
            organizations.organization_id,
            COUNT(CASE intervention_areas.type WHEN 'nation' THEN 1 ELSE NULL END) > 0 AS is_national,
            array_remove(array_agg(
                COALESCE(
                    intervention_areas.fk_region,
                    d1.fk_region,
                    d2.fk_region,
                    d3.fk_region
                )
            ), null) AS regions
        FROM organizations
        LEFT JOIN intervention_areas ON intervention_areas.fk_organization = organizations.organization_id

        -- on doit récupérer le code de la région, ce qui se fait différement selon le niveau de l'area
        -- cas d'une ville
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        LEFT JOIN departements d1 ON intervention_areas.fk_departement = d1.code
        -- cas d'un epci
        LEFT JOIN epci_to_departement ON intervention_areas.fk_epci = epci_to_departement.fk_epci
        LEFT JOIN departements d2 ON epci_to_departement.fk_departement = d2.code
        -- cas d'un département
        LEFT JOIN departements d3 ON intervention_areas.fk_departement = d3.code

        WHERE intervention_areas.is_main_area IS TRUE
        GROUP BY orgnaizations.organization_id
    )
    
    SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(organizations.name)),
            word_similarity(unaccent(:search), unaccent(organizations.abbreviation))
        ) AS similarity
    FROM organizations
    ${departementCode !== null
        ? `
    LEFT JOIN departements ON departements.code = :departementCode
    LEFT JOIN organization_regions ON organizations.organization_id = organization_regions.organization_id`
        : ''
}
    WHERE
        unaccent(:search) % ANY(
            string_to_array(unaccent(organizations.name), ' ')
            ||
            string_to_array(unaccent(organizations.abbreviation), ' ')
        )
        ${departementCode !== null ? `
        AND
        (organization_regions.is_national IS TRUE
            OR
            departements.fk_region = ANY(organization_regions.regions))` : ''}
    ORDER BY similarity DESC
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            search,
            departementCode,
        },
    },
);
