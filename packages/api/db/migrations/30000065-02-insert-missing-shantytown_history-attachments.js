module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const rows = await queryInterface.sequelize.query(
                `SELECT
                    up.fk_user,
                    up.fk_organization,
                    upa.fk_region,
                    upa.fk_departement,
                    upa.fk_epci,
                    upa.fk_city,
                    upa.fk_shantytown,
                    upa.fk_action,
                    upa.fk_plan
                FROM user_permission_attachments upa
                LEFT JOIN user_permissions up ON upa.fk_user_permission = up.user_permission_id
                LEFT JOIN user_permissions up2 ON (up.fk_user = up2.fk_user OR up.fk_organization = up2.fk_organization) AND up2.fk_feature = 'export' AND up2.fk_entity = 'shantytown_history'
                WHERE up.fk_feature = 'list' AND up.fk_entity = 'shantytown' AND up.allowed IS TRUE AND up2.user_permission_id IS NULL`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            if (rows.length > 0) {
                const data = await queryInterface.sequelize.query(
                    `INSERT INTO user_permissions(fk_user, fk_organization, fk_feature, fk_entity, allowed, allow_all)
                    VALUES
                    ${rows.map(() => '(?, ?, \'export\', \'shantytown_history\', TRUE, FALSE)').join(',')}
                    RETURNING user_permission_id`,
                    {
                        type: queryInterface.sequelize.QueryTypes.INSERT,
                        transaction,
                        replacements: rows.map(row => [row.fk_user, row.fk_organization]).flat(),
                    },
                );

                await queryInterface.sequelize.query(
                    `INSERT INTO user_permission_attachments(fk_user_permission, fk_region, fk_departement, fk_epci, fk_city, fk_shantytown, fk_action, fk_plan)
                    VALUES
                    ${data[0].map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(',')}`,
                    {
                        type: queryInterface.sequelize.QueryTypes.INSERT,
                        transaction,
                        replacements: data[0].map((d, index) => [
                            d.user_permission_id,
                            rows[index].fk_region,
                            rows[index].fk_departement,
                            rows[index].fk_epci,
                            rows[index].fk_city,
                            rows[index].fk_shantytown,
                            rows[index].fk_action,
                            rows[index].fk_plan,
                        ]).flat(),
                    },
                );
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: () => Promise.resolve(),
};
