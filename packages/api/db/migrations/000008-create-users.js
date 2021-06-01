module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'users',
        {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            salt: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fk_departement: {
                type: Sequelize.STRING(3),
                allowNull: true,
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
    )
        .then(() => Promise.all([
            queryInterface.addConstraint('users', ['email'], {
                type: 'unique',
                name: 'uk_user_email',
            }),
            queryInterface.addConstraint('users', ['fk_departement'], {
                type: 'foreign key',
                name: 'fk_user_departement',
                references: {
                    table: 'departements',
                    field: 'code',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),
        ])),

    down: queryInterface => queryInterface.dropTable('users'),
};
