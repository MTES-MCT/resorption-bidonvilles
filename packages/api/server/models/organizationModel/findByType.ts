import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type OrganizationMin = {
    id: number,
    name: string,
    abbreviation: string | null,
    territory: string | null,
};

type StructureList = {
    type: string,
    organization_type_name: string,
    organizations: OrganizationMin[],
};

export default (typeId: number): Promise<StructureList[]> => sequelize.query(
    `SELECT
        jsonb_build_object(
            'type', intervention_areas.type,
            'organization_type_name', organization_types.name_singular,
            'organizations', jsonb_agg(
                jsonb_build_object(
                    'id', organizations.organization_id,
                    'name', organizations.name,
                    'abbreviation', organizations.abbreviation,
                    'territory', CASE
                        WHEN intervention_areas.type = 'city' THEN cities.fk_departement || ' - ' ||  cities.name
                        WHEN intervention_areas.type = 'epci' THEN epci.name
                        WHEN intervention_areas.type = 'departement' THEN departements.code || ' - ' || departements.name
                        WHEN intervention_areas.type = 'region' THEN regions.name
                        WHEN intervention_areas.type = 'nation' THEN 'France entière'
                        ELSE NULL
                    END
                )
                ORDER BY (
                    CASE
                        WHEN intervention_areas.type = 'departement' THEN departements.code
                        WHEN intervention_areas.type = 'region' THEN regions.name
                        WHEN intervention_areas.type = 'city' THEN cities.name
                        WHEN intervention_areas.type = 'epci' THEN epci.name
                    END
                ) ASC
            )
        ) as structuresList
    FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    LEFT JOIN intervention_areas ON organizations.organization_id = intervention_areas.fk_organization
    LEFT JOIN regions ON intervention_areas.fk_region = regions.code
    LEFT JOIN departements ON intervention_areas.fk_departement = departements.code
    LEFT JOIN epci ON intervention_areas.fk_epci = epci.code
    LEFT JOIN cities ON intervention_areas.fk_city = cities.code
    WHERE organizations.fk_type = :typeId
    GROUP BY intervention_areas.type, organization_types.name_singular;`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            typeId,
        },
    },
);
