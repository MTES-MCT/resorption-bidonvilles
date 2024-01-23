module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'attachments_archives',
        {
            attachment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            original_file_key: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            preview_file_key: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    ),

    down: queryInterface => queryInterface.dropTable('attachments_archives'),
};
