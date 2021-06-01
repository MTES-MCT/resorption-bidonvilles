module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.query(
        'SELECT organization_id FROM organizations WHERE name = \'Inconnu\'',
        {
            type: queryInterface.sequelize.QueryTypes.SELECT,
        },
    )
        .then(([{ organization_id: orgId }]) => queryInterface.sequelize.transaction(
            transaction => queryInterface.addColumn(
                'users',
                'fk_organization',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: orgId,
                },
                {
                    transaction,
                },
            )
                .then(() => queryInterface.changeColumn(
                    'users',
                    'fk_organization',
                    {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        defaultValue: null,
                    },
                    {
                        transaction,
                    },
                ))
                .then(() => queryInterface.addConstraint(
                    'users',
                    ['fk_organization'],
                    {
                        type: 'foreign key',
                        name: 'fk_users_organization',
                        references: {
                            table: 'organizations',
                            field: 'organization_id',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'restrict',
                        transaction,
                    },
                )),
        )),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_users_organization',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'users',
                'fk_organization',
                { transaction },
            )),
    ),

};
