

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.addColumn(
            'shantytowns',
            'closing_context',
            {
                type: Sequelize.STRING,
                allowNull: true,

            },
            {
                transaction,
            },
        );
        await queryInterface.addColumn(
            'ShantytownHistories',
            'closing_context',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        );

        // on s'assure que closing_context n'est pas renseigné si le site n'est pas fermé (i.e closed_at est null)
        await queryInterface.addConstraint(
            'shantytowns',
            ['closed_at', 'closing_context'],
            {
                type: 'check',
                name: 'check_closed_at-not-null-if-context',
                where: {
                    [Sequelize.Op.not]:
                        {
                            [Sequelize.Op.and]: {
                                closing_context: { [Sequelize.Op.ne]: null },
                                closed_at: { [Sequelize.Op.eq]: null },
                            },
                        },

                },
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            `UPDATE shantytowns 
            SET 
                closing_context = 'Décision administrative (sans précision de l''émetteur)',
                status = 'Unknown'
            WHERE status = 'closed_by_admin'
            `,
            { transaction },
        );
        await queryInterface.sequelize.query(
            `UPDATE "ShantytownHistories"
            SET
                closing_context = 'Décision administrative (sans précision de l''émetteur)',
                status = 'Unknown'
            WHERE status = 'closed_by_admin'
            `,
            { transaction },
        );
        await transaction.commit();
    },

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.sequelize.query(
                `UPDATE shantytowns 
                SET 
                    status = 'closed_by_admin'
                WHERE 
                    status = 'Unknown'
                    AND closing_context = 'Décision administrative (sans précision de l''émetteur)'
                `,
                { transaction },
            ),
            queryInterface.sequelize.query(
                `UPDATE "ShantytownHistories"
                SET 
                    status = 'closed_by_admin'
                WHERE 
                    status = 'Unknown'
                    AND closing_context = 'Décision administrative (sans précision de l''émetteur)'
                `,
                { transaction },
            ),
            queryInterface.removeConstraint('shantytowns', 'check_closed_at-not-null-if-context', { transaction }),
            queryInterface.removeColumn(
                'shantytowns',
                'closing_context',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'closing_context',
                { transaction },
            ),
        ]),

    ),
};
