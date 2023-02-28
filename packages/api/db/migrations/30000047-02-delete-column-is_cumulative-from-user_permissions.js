module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeConstraint(
                'user_permissions',
                'check_is_cumulative_is_null',
                { transaction },
            );
            await queryInterface.removeColumn(
                'user_permissions',
                'is_cumulative',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                'user_permissions',
                'is_cumulative',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.sequelize.query(
                'UPDATE user_permissions SET is_cumulative = TRUE WHERE allowed IS TRUE',
                { transaction },
            );

            await queryInterface.addConstraint(
                'user_permissions', {
                    fields: ['is_cumulative'],
                    type: 'check',
                    name: 'check_is_cumulative_is_null',
                    where: {
                        [Sequelize.Op.or]: [
                            // allowed est false => is_cumulative est null
                            {
                                [Sequelize.Op.and]: {
                                    allowed: { [Sequelize.Op.eq]: false },
                                    is_cumulative: { [Sequelize.Op.eq]: null },
                                },
                            },
                            // allowed est true => is_cumulative n'est pas null
                            {
                                [Sequelize.Op.and]: {
                                    allowed: { [Sequelize.Op.eq]: true },
                                    is_cumulative: { [Sequelize.Op.ne]: null },
                                },
                            },
                        ],
                    },
                    transaction,
                },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
