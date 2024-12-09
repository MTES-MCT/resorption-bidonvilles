/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { QueryTypes } = require('sequelize');

const deptsInvolved = ('44');

function getInsertObject(user, feature) {
    return {
        fk_user: user.user_id,
        fk_organization: null,
        fk_feature: feature,
        fk_entity: 'shantytown_resorption',
        allowed: true,
        type: user.fk_role === 'national_admin' ? 'nation' : 'departement',
        fk_region: null,
        fk_departement: user.fk_role === 'national_admin' ? null : user.fk_departement,
        fk_epci: null,
        fk_city: null,
    };
}

async function createShantytownResorptionEntity(queryInterface, transaction) {
    await queryInterface.bulkInsert(
        'entities',
        [{ name: 'shantytown_resorption' }],
        { transaction },
    );
}

async function createShantytownResorptionFeatures(queryInterface, features, transaction) {
    const featuresObjectsToInsert = features.map(feature => ({
        name: feature,
        fk_entity: 'shantytown_resorption',
        is_writing: true,
    }));

    await queryInterface.bulkInsert(
        'features',
        featuresObjectsToInsert,
        { transaction },
    );
}

async function insertPermissionsForUser(queryInterface, features, user, transaction) {
    const insertObjects = features.map(feature => getInsertObject(user, feature));
    await Promise.all(await queryInterface.bulkInsert('permissions', insertObjects, { transaction }));
}

async function insertPermissions(queryInterface, users, transaction) {
    if (users.length > 0) {
        for (const user of users) {
            await insertPermissionsForUser(queryInterface, ['create', 'update'], user, transaction);
        }
    }
}

async function deleteFromTable(queryInterface, tableName, condition, transaction) {
    await queryInterface.sequelize.query(
        `DELETE FROM ${tableName} WHERE ${condition}`,
        { transaction },
    );
}

async function getUsers(queryInterface, transaction) {
    const users = await queryInterface.sequelize.query(
        `SELECT DISTINCT ON (u.user_id, u.fk_role, u.fk_role_regular)
                uap.fk_departement,
                u.user_id,
                u.fk_role,
                u.fk_role_regular
            FROM
                users u
            LEFT JOIN
                user_actual_permissions uap ON uap.fk_user = u.user_id
            WHERE
                u.fk_status = 'active'
            AND
            (
                (
                    u.fk_role_regular = 'direct_collaborator'
                    AND
                        uap.fk_departement IN (:deptsCodes)
                )
                OR
                    u.fk_role = 'national_admin'                    
            )
            ORDER BY 
                u.user_id, u.fk_role, u.fk_role_regular, uap.fk_departement ;`,
        {
            transaction,
            replacements: {
                deptsCodes: deptsInvolved,
            },
            type: QueryTypes.SELECT,
        },
    );
    return users.length > 0 ? users : [];
}

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await createShantytownResorptionEntity(queryInterface, transaction);
            await createShantytownResorptionFeatures(queryInterface, ['create', 'update'], transaction);
            const users = await getUsers(queryInterface, transaction);

            if (users.length > 0) {
                await insertPermissions(queryInterface, users, transaction);
            }
            await transaction.commit();
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

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
