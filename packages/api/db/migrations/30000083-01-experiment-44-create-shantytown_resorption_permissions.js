const { QueryTypes } = require('sequelize');

const deptsInvolved = ('44');

function getInsertObject(user, feature) {
    return {
        fk_user: user.user_id,
        fk_organization: null,
        fk_feature: feature,
        fk_entity: 'shantytown_resorption',
        allowed: true,
        type: 'departement',
        fk_region: null,
        fk_departement: user.fk_departement,
        fk_epci: null,
        fk_city: null,
    };
}

async function insertPermissions(queryInterface, feature, user, transaction) {
    const insertObject = getInsertObject(user, feature);
    await queryInterface.bulkInsert('permissions', [insertObject], { transaction });
}

async function deleteFromTable(queryInterface, tableName, condition, transaction) {
    await queryInterface.sequelize.query(
        `DELETE FROM ${tableName} WHERE ${condition}`,
        { transaction },
    );
}

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.bulkInsert(
                'entities',
                [{ name: 'shantytown_resorption' }],
                { transaction },
            );
            await queryInterface.bulkInsert(
                'features',
                [{ name: 'create', fk_entity: 'shantytown_resorption', is_writing: true }],
                { transaction },
            );
            await queryInterface.bulkInsert(
                'features',
                [{ name: 'update', fk_entity: 'shantytown_resorption', is_writing: true }],
                { transaction },
            );

            const users = await queryInterface.sequelize.query(
                `SELECT DISTINCT ON (u.user_id, u.fk_role_regular)
                        uap.fk_departement,
                        u.user_id,
                        u.fk_role_regular
                    FROM
                        users u
                    LEFT JOIN
                        user_actual_permissions uap ON uap.fk_user = u.user_id
                    WHERE
                        u.fk_status = 'active'
                    AND
                        u.fk_role_regular = 'direct_collaborator'
                    AND
                        uap.fk_departement IN (:deptsCodes)
                    ORDER BY 
                        u.user_id, u.fk_role_regular, uap.fk_departement ;`,
                {
                    transaction,
                    replacements: {
                        deptsCodes: deptsInvolved,
                    },
                    type: QueryTypes.SELECT,
                },
            );
            if (users.length > 0) {
                await Promise.all(users.map(async (user) => {
                    try {
                        await insertPermissions(queryInterface, 'create', user, transaction);
                        await insertPermissions(queryInterface, 'update', user, transaction);
                    } catch (err) {
                        // Re-throw the error to propagate it to the main catch block
                        throw err;
                    }
                }));
            }
            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                deleteFromTable(queryInterface, 'permissions', 'fk_entity = \'shantytown_resorption\'', transaction),
                deleteFromTable(queryInterface, 'features', 'fk_entity = \'shantytown_resorption\'', transaction),
                deleteFromTable(queryInterface, 'entities', 'name = \'shantytown_resorption\'', transaction),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
