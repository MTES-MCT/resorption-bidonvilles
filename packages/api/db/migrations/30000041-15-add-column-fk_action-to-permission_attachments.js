function isNull(Sequelize) {
    return { [Sequelize.Op.eq]: null };
}

function isNotNull(Sequelize) {
    return { [Sequelize.Op.ne]: null };
}

function isTheOnlyNotNull(Sequelize, nonNullColumn) {
    return {
        [Sequelize.Op.and]: ['fk_region', 'fk_departement', 'fk_epci', 'fk_city', 'fk_shantytown', 'fk_plan', 'fk_action']
            .reduce((acc, key) => {
                acc[key] = key === nonNullColumn ? isNotNull(Sequelize) : isNull(Sequelize);
                return acc;
            }, {}),
    };
}

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // on ajoute la colonne
        try {
            await queryInterface.addColumn(
                'user_permission_attachments',
                'fk_action',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            // on crée toutes les contraintes
            await queryInterface.removeConstraint(
                'user_permission_attachments',
                'must_have_one_and_only_one_attachment',
                { transaction },
            );
            await Promise.all([
                queryInterface.addConstraint(
                    'user_permission_attachments', {
                        fields: ['fk_user_permission', 'fk_action'],
                        type: 'unique',
                        name: 'uk_user_permission_attachments_action',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'user_permission_attachments', {
                        fields: ['fk_action'],
                        type: 'foreign key',
                        name: 'fk_user_permission_attachment_action',
                        references: {
                            table: 'actions',
                            field: 'action_id',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),

                // on s'assure qu'un (et un seul) attachment a été défini
                queryInterface.addConstraint(
                    'user_permission_attachments', {
                        fields: ['fk_region', 'fk_departement', 'fk_epci', 'fk_city', 'fk_shantytown', 'fk_plan', 'fk_action'],
                        type: 'check',
                        name: 'must_have_one_and_only_one_attachment',
                        where: {
                            [Sequelize.Op.or]: [
                                isTheOnlyNotNull(Sequelize, 'fk_region'),
                                isTheOnlyNotNull(Sequelize, 'fk_departement'),
                                isTheOnlyNotNull(Sequelize, 'fk_epci'),
                                isTheOnlyNotNull(Sequelize, 'fk_city'),
                                isTheOnlyNotNull(Sequelize, 'fk_shantytown'),
                                isTheOnlyNotNull(Sequelize, 'fk_plan'),
                                isTheOnlyNotNull(Sequelize, 'fk_action'),
                            ],
                        },
                        transaction,
                    },
                ),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.removeConstraint('user_permission_attachments', 'fk_user_permission_attachment_action', { transaction }),
                queryInterface.removeConstraint('user_permission_attachments', 'uk_user_permission_attachments_action', { transaction }),
                queryInterface.removeConstraint('user_permission_attachments', 'must_have_one_and_only_one_attachment', { transaction }),
            ]);

            await queryInterface.addConstraint(
                'user_permission_attachments', {
                    fields: ['fk_region', 'fk_departement', 'fk_epci', 'fk_city', 'fk_shantytown', 'fk_plan'],
                    type: 'check',
                    name: 'must_have_one_and_only_one_attachment',
                    where: {
                        [Sequelize.Op.or]: [
                            isTheOnlyNotNull(Sequelize, 'fk_region'),
                            isTheOnlyNotNull(Sequelize, 'fk_departement'),
                            isTheOnlyNotNull(Sequelize, 'fk_epci'),
                            isTheOnlyNotNull(Sequelize, 'fk_city'),
                            isTheOnlyNotNull(Sequelize, 'fk_shantytown'),
                            isTheOnlyNotNull(Sequelize, 'fk_plan'),
                        ],
                    },
                    transaction,
                },
            );

            await queryInterface.removeColumn('user_permission_attachments', 'fk_action', { transaction });
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

};
