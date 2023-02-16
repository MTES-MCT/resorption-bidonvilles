const createOldView = require('./common/user_actual_permissions/08_support_actions');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            await queryInterface.sequelize.query(
                `CREATE OR REPLACE VIEW user_actual_permissions AS SELECT * FROM (SELECT
                    t.*,
                  RANK() OVER(
                      PARTITION BY t.fk_user, t.fk_entity, t.fk_feature ORDER BY priority DESC
                  ) AS "rank"
                FROM (
                (SELECT
                    1 as priority,
                    'role' as level,
                         user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_role)
                UNION
                (SELECT
                    2 as priority,
                    'option' as level,
                         user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_option)
                UNION
                (SELECT
                    3 as priority,
                    'organization' as level,
                         user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_org)
                UNION
                (SELECT
                    4 as priority,
                    'user' as level,
                         user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_user)
                ) t) t2
                WHERE rank = 1`,
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DROP VIEW user_actual_permissions',
                { transaction },
            );
            await createOldView(queryInterface, transaction);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
