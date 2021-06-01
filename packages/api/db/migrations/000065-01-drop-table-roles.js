module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.dropTable(
            'roles',
            {
                transaction,
            },
        ),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'roles',
            {
                role_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => {
                const roles = ['superadmin', 'admin', 'visitor'];

                return queryInterface.sequelize.query(
                    `INSERT INTO roles(name) VALUES (${roles.map((name, index) => `:name${index}`).join('),(')})`,
                    {
                        replacements: roles.reduce(
                            (map, name, index) => Object.assign(map, {
                                [`name${index}`]: name,
                            }),
                            {},
                        ),
                        transaction,
                    },
                );
            }),
    ),

};
