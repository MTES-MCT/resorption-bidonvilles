module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
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
    ),
    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW shantytown_watchers',
    ),
};
