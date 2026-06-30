module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_favorite_shantytowns', {
            fk_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            fk_shantytown: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'shantytowns',
                    key: 'shantytown_id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addConstraint('user_favorite_shantytowns', {
            fields: ['fk_user', 'fk_shantytown'],
            type: 'primary key',
            name: 'user_favorite_shantytowns_pkey',
        });

        await queryInterface.addIndex('user_favorite_shantytowns', {
            fields: ['fk_user'],
            name: 'user_favorite_shantytowns_fk_user_idx',
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('user_favorite_shantytowns');
    },
};
