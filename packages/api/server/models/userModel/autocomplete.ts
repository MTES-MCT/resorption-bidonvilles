import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type UserAutocompleteRow = {
    id: number,
    first_name: string,
    last_name: string,
    organization_id: number,
    organization_name: string,
    organization_abbreviation: string | null,
    similarity: number,
};

export default async (search: string, departementCode: string = null): Promise<UserAutocompleteRow[]> => sequelize.query(
    `
    WITH user_regions AS (
        SELECT
            users.user_id,
            COUNT(CASE intervention_areas.type WHEN 'nation' THEN 1 ELSE NULL END) > 0 AS is_national,
            array_remove(array_agg(
                COALESCE(
                    intervention_areas.fk_region,
                    d1.fk_region,
                    d2.fk_region,
                    d3.fk_region
                )
            ), null) AS regions
        FROM users
        LEFT JOIN intervention_areas ON intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
        
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
        GROUP BY users.user_id
    )

    SELECT
        users.user_id AS id,
        users.first_name,
        users.last_name,
        users.fk_organization AS organization_id,
        organizations.name AS organization_name,
        organizations.abbreviation AS organization_abbreviation,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(users.first_name)),
            word_similarity(unaccent(:search), unaccent(users.last_name))
        ) AS similarity
    FROM users
    LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
    ${departementCode !== null
        ? `
    LEFT JOIN departements ON departements.code = :departementCode
    LEFT JOIN user_regions ON users.user_id = user_regions.user_id`
        : ''}
    WHERE
        users.fk_status = 'active'
        AND
        users.to_be_tracked = TRUE
        AND
        unaccent(:search) % ANY(
            string_to_array(unaccent(users.first_name), ' ')
            ||
            string_to_array(unaccent(users.last_name), ' ')
        )
        ${departementCode !== null ? `
        AND
        (user_regions.is_national IS TRUE
            OR
        departements.fk_region = ANY(user_regions.regions))` : ''}
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
