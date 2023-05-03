module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const rows = await queryInterface.sequelize.query(
                `SELECT
                    uap.permission_id,
                    CASE
                        WHEN uap.is_writing THEN lwl.regions
                        ELSE lrl.regions
                    END AS region,
                    CASE
                        WHEN uap.is_writing THEN lwl.departements
                        ELSE lrl.departements
                    END AS departement,
                    CASE
                        WHEN uap.is_writing THEN lwl.epci
                        ELSE lrl.epci
                    END AS epci,
                    CASE
                        WHEN uap.is_writing THEN lwl.cities
                        ELSE lrl.cities
                    END AS city,
                    CASE
                        WHEN uap.is_writing THEN lwl.shantytowns
                        ELSE lrl.shantytowns
                    END AS shantytown,
                    CASE
                        WHEN uap.is_writing THEN lwl.actions
                        ELSE lrl.actions
                    END AS action
                FROM user_actual_permissions uap
                LEFT JOIN full_user_permissions_by_organization fubo ON uap.user_id = fubo.user_id AND uap.feature = fubo.feature AND uap.entity = fubo.entity
                LEFT JOIN users u ON uap.user_id = u.user_id
                LEFT JOIN local_reading_locations lrl ON lrl.organization_id = u.fk_organization
                LEFT JOIN local_writing_locations lwl ON lwl.organization_id = u.fk_organization
                WHERE uap.allowed IS TRUE
                    AND uap.allow_all IS FALSE
                    AND fubo.allowed IS FALSE
                    AND cardinality(uap.regions) = 0
                    AND cardinality(uap.departements) = 0
                    AND cardinality(uap.epci) = 0
                    AND cardinality(uap.cities) = 0
                    AND cardinality(uap.shantytowns) = 0
                    AND cardinality(uap.actions) = 0
                    AND uap.entity <> 'plan'
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            // pour tous les utilisateurs qui ne sont pas "intervener"
            if (rows.length > 0) {
                await queryInterface.bulkInsert(
                    'user_permission_attachments',
                    rows.map((row) => {
                        const keys = ['region', 'departement', 'epci', 'city', 'shantytown', 'action'];
                        return keys.reduce((acc, key) => {
                            if (row[key]?.length > 0) {
                                acc.push(...row[key].map(id => ({
                                    fk_user_permission: row.permission_id,
                                    [`fk_${key}`]: id,
                                })));
                            }

                            return acc;
                        }, []);
                    }).flat(),
                    { transaction },
                );
            }

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: () => Promise.resolve(true),
};
