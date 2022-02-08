module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.sequelize.query(
                `CREATE VIEW local_writing_locations AS
                SELECT
                    users.user_id,
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
                    END AS "plans"
                    FROM users
                    LEFT JOIN localized_organizations ON users.fk_organization = localized_organizations.organization_id`,
                {
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `CREATE VIEW local_reading_locations AS
                SELECT
                    users.user_id,
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
                    END AS "plans"
                    FROM users
                    LEFT JOIN localized_organizations ON users.fk_organization = localized_organizations.organization_id`,
                {
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `CREATE VIEW attachment_locations AS
                SELECT
                  user_permission_attachments.fk_user_permission,
                  CASE
                    WHEN COUNT(user_permission_attachments.fk_region) > 0 THEN array_agg(user_permission_attachments.fk_region)
                    ELSE array[]::varchar[]
                  END AS regions,
                  CASE
                    WHEN COUNT(user_permission_attachments.fk_departement) > 0 THEN array_agg(user_permission_attachments.fk_departement)
                    ELSE array[]::varchar[]
                  END AS departements,
                  CASE
                    WHEN COUNT(user_permission_attachments.fk_epci) > 0 THEN array_agg(user_permission_attachments.fk_epci)
                    ELSE array[]::varchar[]
                  END AS epci,
                  CASE
                    WHEN COUNT(user_permission_attachments.fk_city) > 0 THEN array_agg(user_permission_attachments.fk_city)
                    ELSE array[]::varchar[]
                  END AS cities,
                  CASE
                    WHEN COUNT(user_permission_attachments.fk_shantytown) > 0 THEN array_agg(user_permission_attachments.fk_shantytown)
                    ELSE array[]::integer[]
                  END AS shantytowns,
                  CASE
                    WHEN COUNT(user_permission_attachments.fk_plan) > 0 THEN array_agg(user_permission_attachments.fk_plan)
                    ELSE array[]::integer[]
                  END AS plans
                FROM user_permission_attachments
                GROUP BY user_permission_attachments.fk_user_permission`,
                {
                    transaction,
                },
            ),
        ]);

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.sequelize.query(
                'DROP VIEW local_writing_locations',
                {
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DROP VIEW local_reading_locations',
                {
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DROP VIEW attachment_locations',
                {
                    transaction,
                },
            ),
        ]);

        return transaction.commit();
    },
};
