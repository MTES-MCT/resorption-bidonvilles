module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `
            CREATE VIEW localized_organizations AS
            (
                SELECT
                    organizations.organization_id AS organization_id,
                    organizations.name AS name,
                    organizations.abbreviation AS abbreviation,
                    organizations.active AS active,
                    organizations.fk_type AS fk_type,
                    organizations.created_at AS created_at,
                    organizations.updated_at AS updated_at,

                    'nation' AS location_type,
                    NULL AS "region_code",
                    NULL AS "region_name",
                    NULL AS "departement_code",
                    NULL AS "departement_name",
                    NULL AS "epci_code",
                    NULL AS "epci_name",
                    NULL AS "city_code",
                    NULL AS "city_name",

                    46.7755829 AS "latitude",
                    2.0497727 AS "longitude"
                FROM
                    organizations
                WHERE
                    organizations.fk_region IS NULL
                    AND
                    organizations.fk_departement IS NULL
                    AND
                    organizations.fk_epci IS NULL
                    AND
                    organizations.fk_city IS NULL
            )
            UNION
            (
                SELECT
                    organizations.organization_id AS organization_id,
                    organizations.name AS name,
                    organizations.abbreviation AS abbreviation,
                    organizations.active AS active,
                    organizations.fk_type AS fk_type,
                    organizations.created_at AS created_at,
                    organizations.updated_at AS updated_at,

                    'region' AS location_type,
                    regions.code AS "region_code",
                    regions.name AS "region_name",
                    NULL AS "departement_code",
                    NULL AS "departement_name",
                    NULL AS "epci_code",
                    NULL AS "epci_name",
                    NULL AS "city_code",
                    NULL AS "city_name",

                    NULL AS "latitude",
                    NULL AS "longitude"
                FROM
                    organizations
                LEFT JOIN
                    regions ON organizations.fk_region = regions.code
                WHERE
                    organizations.fk_region IS NOT NULL
            )
            UNION
            (
                SELECT
                    organizations.organization_id AS organization_id,
                    organizations.name AS name,
                    organizations.abbreviation AS abbreviation,
                    organizations.active AS active,
                    organizations.fk_type AS fk_type,
                    organizations.created_at AS created_at,
                    organizations.updated_at AS updated_at,

                    'departement' AS location_type,
                    regions.code AS "region_code",
                    regions.name AS "region_name",
                    departements.code AS "departement_code",
                    departements.name AS "departement_name",
                    NULL AS "epci_code",
                    NULL AS "epci_name",
                    NULL AS "city_code",
                    NULL AS "city_name",

                    departements.latitude AS "latitude",
                    departements.longitude AS "longitude"
                FROM
                    organizations
                LEFT JOIN
                    departements ON organizations.fk_departement = departements.code
                LEFT JOIN
                    regions ON departements.fk_region = regions.code
                WHERE
                    organizations.fk_departement IS NOT NULL
            )
            UNION
            (
                SELECT
                    organizations.organization_id AS organization_id,
                    organizations.name AS name,
                    organizations.abbreviation AS abbreviation,
                    organizations.active AS active,
                    organizations.fk_type AS fk_type,
                    organizations.created_at AS created_at,
                    organizations.updated_at AS updated_at,

                    'epci' AS location_type,
                    regions.code AS "region_code",
                    regions.name AS "region_name",
                    departements.code AS "departement_code",
                    departements.name AS "departement_name",
                    epci.code AS "epci_code",
                    epci.name AS "epci_name",
                    NULL AS "city_code",
                    NULL AS "city_name",

                    departements.latitude AS "latitude",
                    departements.longitude AS "longitude"
                FROM
                    organizations
                LEFT JOIN
                    epci_to_departement ON epci_to_departement.fk_epci = organizations.fk_epci
                LEFT JOIN
                    departements ON epci_to_departement.fk_departement = departements.code
                LEFT JOIN
                    epci ON organizations.fk_epci = epci.code
                LEFT JOIN
                    regions ON departements.fk_region = regions.code
                WHERE
                    organizations.fk_epci IS NOT NULL
            )
            UNION
            (
                SELECT
                    organizations.organization_id AS organization_id,
                    organizations.name AS name,
                    organizations.abbreviation AS abbreviation,
                    organizations.active AS active,
                    organizations.fk_type AS fk_type,
                    organizations.created_at AS created_at,
                    organizations.updated_at AS updated_at,

                    'city' AS location_type,
                    regions.code AS "region_code",
                    regions.name AS "region_name",
                    departements.code AS "departement_code",
                    departements.name AS "departement_name",
                    epci.code AS "epci_code",
                    epci.name AS "epci_name",
                    cities.code AS "city_code",
                    cities.name AS "city_name",

                    departements.latitude AS "latitude",
                    departements.longitude AS "longitude"
                FROM
                    organizations
                LEFT JOIN
                    cities ON cities.code = organizations.fk_city
                LEFT JOIN
                    departements ON cities.fk_departement = departements.code
                LEFT JOIN
                    epci ON cities.fk_epci = epci.code
                LEFT JOIN
                    regions ON departements.fk_region = regions.code
                WHERE
                    organizations.fk_city IS NOT NULL
            )`,
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW localized_organizations'),

};
