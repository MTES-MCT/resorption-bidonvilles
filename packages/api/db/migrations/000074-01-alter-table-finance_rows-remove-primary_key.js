module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'finance_rows',
            'finance_rows_pkey',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'finance_rows_history',
                'finance_rows_history_pkey',
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.addConstraint(
            'finance_rows',
            ['fk_finance_type', 'fk_finance'],
            {
                type: 'primary key',
                name: 'finance_rows_pkey',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'finance_rows_history',
                ['fk_finance_type', 'fk_finance'],
                {
                    type: 'primary key',
                    name: 'finance_rows_history_pkey',
                },
                {
                    transaction,
                },
            )),
    ),

};
