module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `CREATE VIEW last_user_accesses AS
            (
                SELECT
                    ua.*
                FROM user_accesses ua
                LEFT JOIN (SELECT
                fk_user,
                MAX(created_at) AS created_at
                FROM
                    user_accesses
                GROUP BY fk_user) t ON t.fk_user = ua.fk_user AND t.created_at = ua.created_at
                WHERE t.fk_user IS NOT NULL
            )`,
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.query('DROP VIEW last_user_accesses'),

};
