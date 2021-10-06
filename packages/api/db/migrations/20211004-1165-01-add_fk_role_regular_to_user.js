module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'fk_role_regular',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'new',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'fk_role_regular',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE
                    users AS us2
                SET
                    fk_role_regular =
                (
                    SELECT
                            ot3.fk_role
                    FROM
                            organization_types AS ot3
                    LEFT JOIN
                            organizations AS org3
                                ON org3.fk_type = ot3.organization_type_id 
                    LEFT JOIN
                            users AS us3
                                ON us3.fk_organization = org3.organization_id 
                    WHERE
                            us3.user_id = us2.user_id
                )`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_role_regular'],
                {
                    type: 'foreign key',
                    name: 'fk_users_role_regular',
                    references: {
                        table: 'roles_regular',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                 SET fk_type = 4
                 WHERE organization_id IN (14243, 14310, 14314, 14338, 14360, 14399, 34116, 34195)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                 SET fk_type = 5
                 WHERE organization_id IN (39854, 40344)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                    SET fk_type = 6
                    WHERE organization_id IN (40671)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                    SET fk_type = 14
                    WHERE organization_id IN (40904)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `UPDATE organizations
                    SET fk_type = 8
                    WHERE organization_id IN (41494, 41579, 41595, 41616, 41634, 41644, 41653, 41658, 41942)`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkDelete(
                'organization_types',
                {
                    fk_role: 'intervener',
                    fk_category: 'intervener',
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkDelete(
                'organization_categories',
                {
                    uid: 'intervener',
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO organization_categories(uid, name_singular, name_plural) VALUES(\'intervener\', \'Intervenant\', \'Intervenants\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO organization_types(name_singular, name_plural, fk_category, fk_role, uid) VALUES(\'Intervenant\', \'Intervenants\', \'intervener\', \'intervener\', \'intervenant\')',
                {
                    transaction,
                },
            )
                .then(() => queryInterface.sequelize.query(
                    `UPDATE organizations
                        SET fk_type = (SELECT organization_type_id FROM organization_types WHERE LOWER(name_singular)='intervenant')
                        WHERE organization_id IN (14243, 14310, 14314, 14338, 14360, 14399, 34116, 34195, 39854, 40344, 40671, 40904, 41494, 41579, 41595, 41616, 41634, 41644, 41653, 41658, 41942)`,
                    {
                        transaction,
                    },
                )))
            .then(() => queryInterface.removeConstraint(
                'users',
                'fk_users_role_regular',
                { transaction },
            )
                .then(() => queryInterface.removeColumn(
                    'users',
                    'fk_role_regular',
                    { transaction },
                ))),
    ),
};
