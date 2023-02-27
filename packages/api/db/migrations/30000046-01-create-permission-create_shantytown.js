module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                'INSERT INTO permission_options(uid, name) VALUES(\'create_shantytown\', \'Autoriser l\'\'utilisateur à déclarer un site\')',
                { transaction },
            );

            await queryInterface.sequelize.query(
                `INSERT INTO user_permission_options(fk_user, fk_option)
                (
                    SELECT fk_user, 'create_shantytown' FROM user_permission_options WHERE fk_option = 'create_and_close_shantytown'
                    UNION
                    SELECT fk_user, 'close_shantytown' FROM user_permission_options WHERE fk_option = 'create_and_close_shantytown'
                )`,
                { transaction },
            );

            await queryInterface.sequelize.query(
                'DELETE FROM user_permission_options WHERE fk_option = \'create_and_close_shantytown\'',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM permission_options WHERE uid = \'create_and_close_shantytown\'',
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
                'INSERT INTO permission_options(uid, name) VALUES(\'create_and_close_shantytown\', \'Autoriser l\'\'opérateur à créer un site et déclarer la fermeture d\'\'un site\')',
                { transaction },
            );

            await queryInterface.sequelize.query(
                `INSERT INTO user_permission_options(fk_user, fk_option)
                (
                    SELECT fk_user, 'create_and_close_shantytown' FROM (SELECT fk_user, array_agg(fk_option) AS options FROM user_permission_options GROUP BY fk_user) t
                    WHERE 'close_shantytown' = ANY(options) AND 'create_shantytown' = ANY(options)
                )`,
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM user_permission_options WHERE fk_option IN (\'create_shantytown\', \'close_shantytown\') AND fk_user IN (SELECT fk_user FROM user_permission_options WHERE fk_option = \'create_and_close_shantytown\')',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM permission_options WHERE uid = \'create_shantytown\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
