module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO user_statuses(user_status_id) VALUES 
                (
                    'refused'
                )`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        `DELETE FROM user_statuses 
        WHERE
            user_status_id = 'refused'`,
    ),
};
