module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            `
            CREATE MATERIALIZED VIEW organizations_users
            AS
            (
              SELECT o.organization_id, o.name, o.abbreviation, o.active, o.fk_type, fk_region, fk_departement, fk_epci, fk_city, o.created_at, o.updated_at, being_funded, being_funded_at  
            FROM organizations o
            left join users on users.fk_organization = o.organization_id
            WHERE users.user_id is not null
            group by organization_id
            )
            WITH DATA`,
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            `
            CREATE MATERIALIZED VIEW cities_users
            AS
            (
            SELECT cities.code, cities.name, cities.fk_main, cities.fk_epci, cities.fk_departement, cities.latitude, cities.longitude
            FROM cities
            LEFT JOIN localized_organizations lo ON lo.city_code = cities.code
            LEFT JOIN users ON users.fk_organization = lo.organization_id
            LEFT JOIN shantytowns ON shantytowns.fk_city = cities.code
            WHERE users.user_id is not null
            OR shantytowns.shantytown_id IS NOT null
            GROUP BY cities.code
            )
            WITH DATA
            `,
            {
                transaction,
            },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            'DROP MATERIALIZED VIEW organizations_users',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'DROP MATERIALIZED VIEW cities_users',
            { transaction },
        );

        return transaction.commit();
    },
};
