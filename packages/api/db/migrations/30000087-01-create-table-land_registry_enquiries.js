module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'land_registry_enquiries',
                {
                    enquiry_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    fk_user: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    fk_organization: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    fk_parcel: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                    },
                },
                { transaction },
            );

            await Promise.all([
                queryInterface.addConstraint('land_registry_enquiries', {
                    fields: ['fk_user'],
                    type: 'foreign key',
                    name: 'fk__land_registry_enquiry__user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),

                queryInterface.addConstraint('land_registry_enquiries', {
                    fields: ['fk_organization'],
                    type: 'foreign key',
                    name: 'fk__user_question_subscriptions__organization',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addIndex(
                    'land_registry_enquiries',
                    ['fk_parcel'],
                    {
                        name: 'id__land_registry_enquiries__fk_parcel',
                        using: 'BTREE',
                        schema: 'public',
                        transaction,
                    },
                ),
            ]);
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
                queryInterface.removeConstraint(
                    'land_registry_enquiries',
                    'fk__user_question_subscriptions__organization',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'land_registry_enquiries',
                    'fk__land_registry_enquiry__user',
                    { transaction },
                ),
            ]);

            await queryInterface.dropTable('land_registry_enquiries', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
