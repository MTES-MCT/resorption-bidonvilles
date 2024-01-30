module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `UPDATE features
        SET is_writing = false
        WHERE (fk_entity = 'action' AND name IN ('create', 'update'))
        OR (fk_entity = 'action_comment' AND name IN ('create'))`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        `UPDATE features
        SET is_writing = true
        WHERE (fk_entity = 'action' AND name IN ('create', 'update'))
        OR (fk_entity = 'action_comment' AND name IN ('create'))`,
    ),
};
