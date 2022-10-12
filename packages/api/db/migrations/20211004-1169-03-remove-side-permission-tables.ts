const createCovidCommentTable = require('./common/create_covid_comment_permissions');
const createPlanFinancesTable = require('./common/create_plan_finances_permissions');
const createPlanTable = require('./common/create_plan_permissions');
const createShantytownCommentTable = require('./common/create_shantytown_comment_permissions');
const createShantytownTable = require('./common/create_shantytown_permissions');
const createStatsTable = require('./common/create_stats_permissions');
const createUserTable = require('./common/create_user_permissions');

function removeCheck(entity, queryInterface, transaction) {
    return queryInterface.sequelize.query(
        `DROP TRIGGER ${entity}_permission_check ON ${entity}_permissions`,
        {
            transaction,
        },
    );
}

function removeFunction(entity, queryInterface, transaction) {
    return queryInterface.sequelize.query(
        `DROP FUNCTION ${entity}_permission_check()`,
        {
            transaction,
        },
    );
}

function removeConstraint(entity, queryInterface, transaction) {
    return queryInterface.removeConstraint(
        `${entity}_permissions`,
        `fk_${entity}_permissions_permission`,
        {
            transaction,
        },
    );
}

function dropTable(entity, queryInterface, transaction) {
    return queryInterface.dropTable(
        `${entity}_permissions`,
        {
            transaction,
        },
    );
}

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            removeCheck('covid_comment', queryInterface, transaction),
            removeCheck('plan_finances', queryInterface, transaction),
            removeCheck('plan', queryInterface, transaction),
            removeCheck('shantytown_comment', queryInterface, transaction),
            removeCheck('shantytown', queryInterface, transaction),
            removeCheck('stats', queryInterface, transaction),
            removeCheck('user', queryInterface, transaction),
        ])
            .then(() => Promise.all([
                removeFunction('covid_comment', queryInterface, transaction),
                removeFunction('plan_finances', queryInterface, transaction),
                removeFunction('plan', queryInterface, transaction),
                removeFunction('shantytown_comment', queryInterface, transaction),
                removeFunction('shantytown', queryInterface, transaction),
                removeFunction('stats', queryInterface, transaction),
                removeFunction('user', queryInterface, transaction),
            ]))
            .then(() => Promise.all([
                removeConstraint('covid_comment', queryInterface, transaction),
                removeConstraint('plan_finances', queryInterface, transaction),
                removeConstraint('plan', queryInterface, transaction),
                removeConstraint('shantytown_comment', queryInterface, transaction),
                removeConstraint('shantytown', queryInterface, transaction),
                removeConstraint('stats', queryInterface, transaction),
                removeConstraint('user', queryInterface, transaction),
            ]))
            .then(() => Promise.all([
                dropTable('covid_comment', queryInterface, transaction),
                dropTable('plan_finances', queryInterface, transaction),
                dropTable('plan', queryInterface, transaction),
                dropTable('shantytown_comment', queryInterface, transaction),
                dropTable('shantytown', queryInterface, transaction),
                dropTable('stats', queryInterface, transaction),
                dropTable('user', queryInterface, transaction),
            ])),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            createCovidCommentTable(queryInterface, Sequelize, transaction),
            createPlanFinancesTable(queryInterface, Sequelize, transaction),
            createPlanTable(queryInterface, Sequelize, transaction),
            createShantytownCommentTable(queryInterface, Sequelize, transaction),
            createShantytownTable(queryInterface, Sequelize, transaction),
            createStatsTable(queryInterface, Sequelize, transaction),
            createUserTable(queryInterface, Sequelize, transaction),
        ])
            .then(() => queryInterface.addColumn(
                'plan_permissions',
                'data_finances',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `WITH annex_justice AS (
                    SELECT
                        fk_organization, fk_role_admin, fk_role_regular, allowed
                    FROM permissions
                    WHERE fk_entity = 'shantytown_justice' AND fk_feature = 'access'
                    GROUP BY fk_organization, fk_role_admin, fk_role_regular, allowed
                )
                SELECT
                    permission_id,
                    p.fk_entity,
                    CASE WHEN p.fk_entity = 'shantytown' THEN COALESCE(aj.allowed, FALSE) ELSE NULL END AS data_justice,
                    CASE WHEN p.fk_entity = 'plan' THEN FALSE ELSE NULL END AS data_finances
                FROM permissions p
                LEFT JOIN annex_justice aj ON (aj.fk_organization = p.fk_organization OR aj.fk_role_admin = p.fk_role_admin OR aj.fk_role_regular = p.fk_role_regular)
                WHERE fk_entity <> 'shantytown_justice'`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then((rows) => {
                const data = rows.reduce((argAcc, {
                    permission_id, fk_entity, data_justice, data_finances,
                }) => {
                    const acc = { ...argAcc };
                    if (!acc[fk_entity]) {
                        acc[fk_entity] = [];
                    }

                    acc[fk_entity].push({
                        fk_permission: permission_id,
                        ...(data_justice !== null ? { data_justice } : {}),
                        ...(data_finances !== null ? { data_finances } : {}),
                    });

                    return acc;
                }, {});

                return Promise.all(
                    Object.keys(data).map(entity => queryInterface.bulkInsert(
                        `${entity}_permissions`,
                        data[entity],
                        { transaction },
                    )),
                );
            }),
    ),

};
