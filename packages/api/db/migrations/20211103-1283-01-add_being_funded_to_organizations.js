// function updateRows(queryInterface) {
//     return queryInterface.sequelize.query('UPDATE organizations SET beingFunded = false WHERE being_funded IS NULL;');
// }

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'organizations',
            'being_funded',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            {
                transaction,
            },
        ).then(() => queryInterface.addColumn(
            'organizations',
            'being_funded_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                transaction,
            },
        ).then(() => queryInterface.sequelize.query(
            'DROP VIEW IF EXISTS shantytown_watchers',
            {
                transaction,
            },
        )).then(() => queryInterface.sequelize.query(
            'DROP MATERIALIZED VIEW IF EXISTS localized_organizations',
            {
                transaction,
            },
        )).then(() => queryInterface.sequelize.query(
            `CREATE MATERIALIZED VIEW localized_organizations AS
                (
                    SELECT
                        organizations.organization_id AS organization_id,
                        organizations.name AS name,
                        organizations.abbreviation AS abbreviation,
                        organizations.active AS active,
                        organizations.fk_type AS fk_type,
                        organizations.created_at AS created_at,
                        organizations.updated_at AS updated_at,
                        organizations.being_funded AS being_funded,
                        organizations.being_funded_at AS being_funded_at,
    
                        'nation' AS location_type,
                        NULL AS "region_code",
                        NULL AS "region_name",
                        NULL AS "departement_code",
                        NULL AS "departement_name",
                        NULL AS "epci_code",
                        NULL AS "epci_name",
                        NULL AS "city_code",
                        NULL AS "city_name",
                        NULL AS "city_main",
    
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
                        organizations.being_funded AS being_funded,
                        organizations.being_funded_at AS being_funded_at,
    
                        'region' AS location_type,
                        regions.code AS "region_code",
                        regions.name AS "region_name",
                        NULL AS "departement_code",
                        NULL AS "departement_name",
                        NULL AS "epci_code",
                        NULL AS "epci_name",
                        NULL AS "city_code",
                        NULL AS "city_name",
                        NULL AS "city_main",
    
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
                        organizations.being_funded AS being_funded,
                        organizations.being_funded_at AS being_funded_at,
    
                        'departement' AS location_type,
                        regions.code AS "region_code",
                        regions.name AS "region_name",
                        departements.code AS "departement_code",
                        departements.name AS "departement_name",
                        NULL AS "epci_code",
                        NULL AS "epci_name",
                        NULL AS "city_code",
                        NULL AS "city_name",
                        NULL AS "city_main",
    
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
                        organizations.being_funded AS being_funded,
                        organizations.being_funded_at AS being_funded_at,
    
                        'epci' AS location_type,
                        regions.code AS "region_code",
                        regions.name AS "region_name",
                        departements.code AS "departement_code",
                        departements.name AS "departement_name",
                        epci.code AS "epci_code",
                        epci.name AS "epci_name",
                        NULL AS "city_code",
                        NULL AS "city_name",
                        NULL AS "city_main",
    
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
                        organizations.being_funded AS being_funded,
                        organizations.being_funded_at AS being_funded_at,
    
                        'city' AS location_type,
                        regions.code AS "region_code",
                        regions.name AS "region_name",
                        departements.code AS "departement_code",
                        departements.name AS "departement_name",
                        epci.code AS "epci_code",
                        epci.name AS "epci_name",
                        cities.code AS "city_code",
                        cities.name AS "city_name",
                        cities.fk_main AS "city_main",
    
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
        ))
            .then(() => queryInterface.sequelize.query(
                `CREATE VIEW shantytown_watchers AS
            (
                (
                SELECT
                    s.shantytown_id AS fk_shantytown,
                    u.user_id AS fk_user
                FROM shantytowns s
                LEFT JOIN cities c ON s.fk_city = c.code
                LEFT JOIN departements d ON c.fk_departement = d.code
                LEFT JOIN localized_organizations lo ON lo.region_code = d.fk_region
                LEFT JOIN users u ON u.fk_organization = lo.organization_id
                WHERE
                    lo.active = true
                    AND
                    u.fk_status = 'active'
                    AND
                    lo.location_type = 'region'
                    AND
                    u.fk_role = 'local_admin'
                )
        
                UNION
        
                (
                SELECT
                    s.shantytown_id AS fk_shantytown,
                    u.user_id AS fk_user
                FROM shantytowns s
                LEFT JOIN cities c ON s.fk_city = c.code
                LEFT JOIN localized_organizations lo ON lo.departement_code = c.fk_departement
                LEFT JOIN users u ON u.fk_organization = lo.organization_id
                WHERE
                    lo.active = true
                    AND
                    u.fk_status = 'active'
                    AND
                    u.fk_role = 'local_admin'
                )
        
                UNION
        
                (
                SELECT
                    sa.fk_shantytown,
                    u.user_id AS fk_user
                FROM shantytown_actors sa
                LEFT JOIN users u ON sa.fk_user = u.user_id
                LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                WHERE
                    u.fk_status = 'active'
                    AND
                    o.active = TRUE
                )
            )`,
                {
                    transaction,
                },
            ))),
    ),

    down: queryInterface => Promise.all([
        queryInterface.sequelize.query('DROP VIEW IF EXISTS shantytown_watchers'),
        queryInterface.sequelize.query('DROP MATERIALIZED VIEW IF EXISTS localized_organizations'),
        queryInterface.sequelize.query(
            `CREATE MATERIALIZED VIEW localized_organizations AS
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
                        NULL AS "city_main",

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
                        NULL AS "city_main",

                        regions.latitude AS "latitude",
                        regions.longitude AS "longitude"
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
                        NULL AS "city_main",

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
                        NULL AS "city_main",

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
                        cities.fk_main AS "city_main",

                        cities.latitude AS "latitude",
                        cities.longitude AS "longitude"
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
        ),
    ]).then(() => queryInterface.sequelize.query(
        `CREATE VIEW shantytown_watchers AS
        (
            (
            SELECT
                s.shantytown_id AS fk_shantytown,
                u.user_id AS fk_user
            FROM shantytowns s
            LEFT JOIN cities c ON s.fk_city = c.code
            LEFT JOIN departements d ON c.fk_departement = d.code
            LEFT JOIN localized_organizations lo ON lo.region_code = d.fk_region
            LEFT JOIN users u ON u.fk_organization = lo.organization_id
            WHERE
                lo.active = true
                AND
                u.fk_status = 'active'
                AND
                lo.location_type = 'region'
                AND
                u.fk_role = 'local_admin'
            )

            UNION

            (
            SELECT
                s.shantytown_id AS fk_shantytown,
                u.user_id AS fk_user
            FROM shantytowns s
            LEFT JOIN cities c ON s.fk_city = c.code
            LEFT JOIN localized_organizations lo ON lo.departement_code = c.fk_departement
            LEFT JOIN users u ON u.fk_organization = lo.organization_id
            WHERE
                lo.active = true
                AND
                u.fk_status = 'active'
                AND
                u.fk_role = 'local_admin'
            )

            UNION

            (
            SELECT
                sa.fk_shantytown,
                u.user_id AS fk_user
            FROM shantytown_actors sa
            LEFT JOIN users u ON sa.fk_user = u.user_id
            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
            WHERE
                u.fk_status = 'active'
                AND
                o.active = TRUE
            )
        )`,
        queryInterface.removeColumn('organizations', 'being_funded'),
        queryInterface.removeColumn('organizations', 'being_funded_at'),
    )),
};
