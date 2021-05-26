module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable(
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
    ).then(() => {
        const roles = ['superadmin', 'admin', 'visitor'];

        queryInterface.sequelize.query(
            `INSERT INTO roles(name) VALUES (${roles.map((name, index) => `:name${index}`).join('),(')})`,
            {
                replacements: roles.reduce(
                    (map, name, index) => Object.assign(map, {
                        [`name${index}`]: name,
                    }),
                    {},
                ),
            },
        );
    }),

    down: queryInterface => queryInterface.dropTable('roles'),
};
