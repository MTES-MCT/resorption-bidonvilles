module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'action_metrics',
                'scolaire_mineur_scolarise_dans_annee',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineur_scolarise_dans_annee', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineur_scolarise_dans_annee_lte_nombre_mineurs',
                where: {
                    [Sequelize.Op.or]: [
                        { nombre_mineurs: { [Sequelize.Op.eq]: null } },
                        {
                            scolaire_mineur_scolarise_dans_annee: {
                                [Sequelize.Op.eq]: null,
                            },
                        },
                        {
                            nombre_mineurs: { [Sequelize.Op.ne]: null },
                            scolaire_mineur_scolarise_dans_annee: {
                                [Sequelize.Op.ne]: null,
                                [Sequelize.Op.lte]: Sequelize.col('nombre_mineurs'),
                            },
                        },
                    ],
                },
                transaction,
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineur_scolarise_dans_annee_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeColumn(
                'action_metrics',
                'scolaire_mineur_scolarise_dans_annee',
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
