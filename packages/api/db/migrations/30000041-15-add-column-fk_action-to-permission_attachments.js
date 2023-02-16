function isNull(Sequelize) {
    return { [Sequelize.Op.eq]: null };
}

function isNotNull(Sequelize) {
    return { [Sequelize.Op.ne]: null };
}

function isTheOnlyNotNull(Sequelize, nonNullColumn, includeAction) {
    const cols = ['fk_region', 'fk_departement', 'fk_epci', 'fk_city', 'fk_shantytown', 'fk_plan'];
    if (includeAction === true) {
        cols.push('fk_action');
    }

    return {
        [Sequelize.Op.and]: cols
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
            const INCLUDE_ACTION = true;
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
                                isTheOnlyNotNull(Sequelize, 'fk_region', INCLUDE_ACTION),
                                isTheOnlyNotNull(Sequelize, 'fk_departement', INCLUDE_ACTION),
                                isTheOnlyNotNull(Sequelize, 'fk_epci', INCLUDE_ACTION),
                                isTheOnlyNotNull(Sequelize, 'fk_city', INCLUDE_ACTION),
                                isTheOnlyNotNull(Sequelize, 'fk_shantytown', INCLUDE_ACTION),
                                isTheOnlyNotNull(Sequelize, 'fk_plan', INCLUDE_ACTION),
                                isTheOnlyNotNull(Sequelize, 'fk_action', INCLUDE_ACTION),
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
            const IGNORE_ACTION = false;

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
                            isTheOnlyNotNull(Sequelize, 'fk_region', IGNORE_ACTION),
                            isTheOnlyNotNull(Sequelize, 'fk_departement', IGNORE_ACTION),
                            isTheOnlyNotNull(Sequelize, 'fk_epci', IGNORE_ACTION),
                            isTheOnlyNotNull(Sequelize, 'fk_city', IGNORE_ACTION),
                            isTheOnlyNotNull(Sequelize, 'fk_shantytown', IGNORE_ACTION),
                            isTheOnlyNotNull(Sequelize, 'fk_plan', IGNORE_ACTION),
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
