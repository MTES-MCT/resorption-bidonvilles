module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'user_statuses',
            [
                {
                    user_status_id: 'new',
                },
                {
                    user_status_id: 'active',
                },
                {
                    user_status_id: 'inactive',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('user_statuses'),

};
