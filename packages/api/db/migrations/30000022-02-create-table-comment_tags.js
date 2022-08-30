module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // on crée la table
        await queryInterface.createTable(
            'comment_tags',
            {
                uid: {
                    type: Sequelize.STRING(50),
                    primaryKey: true
                },
                tag: {
                    type: Sequelize.STRING(150),
                    allowNull: false,
                    unique: true
                },
                fk_comment_tag_type: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
            },
            { transaction },
        );

        // on crée toutes les contraintes
        await queryInterface.addConstraint(
            'comment_tags',
            ['fk_comment_tag_type'],
            {
                type: 'foreign key',
                name: 'fk_comment_tag_types_uid',
                references: {
                    table: 'comment_tag_types',
                    field: 'uid',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // on supprime toutes les contraintes
        await queryInterface.removeConstraint(
            'comment_tags',
            'fk_comment_tag_types_uid',
            { transaction },
        );

        // on supprime la table
        await queryInterface.dropTable('comment_tags', { transaction });
        return transaction.commit();
    },
};
