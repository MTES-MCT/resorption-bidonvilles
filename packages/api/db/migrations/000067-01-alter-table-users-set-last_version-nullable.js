module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.changeColumn(
            'users',
            'last_version',
            {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'last_changelog',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'UPDATE users SET last_version = null, last_changelog = null WHERE fk_status = \'new\'',
                {
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'UPDATE users SET last_version = \'0.0.0\', last_changelog = \'0.0.0\' WHERE last_version IS NULL OR last_changelog IS NULL',
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'last_version',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: '0.0.0',
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.changeColumn(
                'users',
                'last_changelog',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: '0.0.0',
                },
                {
                    transaction,
                },
            )),
    ),

};
