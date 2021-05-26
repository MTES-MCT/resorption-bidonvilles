module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'social_origins',
        {
            social_origin_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            label: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    )
        .then(() => queryInterface.addConstraint('social_origins', ['label'], {
            type: 'unique',
            name: 'uk_social_origins_label',
        }))
        .then(() => queryInterface.bulkInsert(
            'social_origins',
            [
                { label: 'Ressortissants français' },
                { label: 'Ressortissants européens' },
                { label: 'Ressortissants extracommunautaires' },
            ],
        )),

    down: queryInterface => queryInterface.dropTable('social_origins'),
};
