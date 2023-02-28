module.exports = [
    // writing_locations
    `CREATE OR REPLACE VIEW local_writing_locations AS
    SELECT
        organization_id,
        CASE
            WHEN location_type = 'nation' then null
            WHEN location_type = 'region' then array[region_code]
            ELSE array[]::varchar[]
        END AS "regions",
        CASE
            WHEN location_type = 'nation' then null
            WHEN location_type = 'departement' then array[departement_code]
            ELSE array[]::varchar[]
        END AS "departements",
        CASE
            WHEN location_type = 'nation' then null
            WHEN location_type = 'epci' then array[epci_code]
            ELSE array[]::varchar[]
        END AS "epci",
        CASE
            WHEN location_type = 'nation' then null
            WHEN location_type = 'city' then array[city_code]
            ELSE array[]::varchar[]
        END AS "cities",
        CASE
            WHEN location_type = 'nation' then NULL
            ELSE array[]::integer[]
        END AS "shantytowns",
        CASE
            WHEN location_type = 'nation' then null
            ELSE array[]::integer[]
        END AS "actions"
    FROM localized_organizations`,

    // reading_locations
    `CREATE OR REPLACE VIEW local_reading_locations AS
    SELECT
        organization_id,
        CASE
            WHEN location_type = 'nation' then null
            WHEN location_type = 'region' then array[region_code]
            ELSE array[]::varchar[]
        END AS "regions",
        CASE
            WHEN location_type = 'nation' then null
            WHEN location_type IN ('city', 'epci', 'departement') then array[departement_code]
            ELSE array[]::varchar[]
        END AS "departements",
        CASE
            WHEN location_type = 'nation' then null
            ELSE array[]::varchar[]
        END AS "epci",
        CASE
            WHEN location_type = 'nation' then null
            ELSE array[]::varchar[]
        END AS "cities",
        CASE
            WHEN location_type = 'nation' then NULL
            ELSE array[]::integer[]
        END AS "shantytowns",
        CASE
            WHEN location_type = 'nation' then null
            ELSE array[]::integer[]
        END AS "actions"
    FROM localized_organizations`,
];
