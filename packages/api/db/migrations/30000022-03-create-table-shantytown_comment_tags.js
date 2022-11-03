module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        // on crée la table
        await queryInterface.createTable(
            'shantytown_comment_tags',
            {
                fk_shantytown_comment: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                },
                fk_comment_tag: {
                    type: Sequelize.STRING(50),
                    primaryKey: true,
                },
            },
            { transaction },
        );
        // on crée les contraintes
        await Promise.all([
            queryInterface.addConstraint(
                'shantytown_comment_tags', {
                    fields: ['fk_shantytown_comment'],
                    type: 'foreign key',
                    name: 'fk_shantytown_comment_id',
                    references: {
                        table: 'shantytown_comments',
                        field: 'shantytown_comment_id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_comment_tags', {
                    fields: ['fk_comment_tag'],
                    type: 'foreign key',
                    name: 'fk_comment_tags_uid',
                    references: {
                        table: 'comment_tags',
                        field: 'uid',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            // Index sur les clés étrangères
            queryInterface.addIndex(
                'shantytown_comment_tags',
                {
                    fields: ['fk_shantytown_comment'],
                    name: 'fk_shantytown_comment_idx',
                    transaction,
                },
            ),
            queryInterface.addIndex(
                'shantytown_comment_tags',
                {
                    fields: ['fk_comment_tag'],
                    name: 'fk_comment_tag_idx',
                    transaction,
                },
            ),
        ]);
        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await Promise.all([
            queryInterface.removeIndex('shantytown_comment_tags', 'fk_comment_tag_idx', { transaction }),
            queryInterface.removeIndex('shantytown_comment_tags', 'fk_shantytown_comment_idx', { transaction }),
            queryInterface.removeConstraint('shantytown_comment_tags', 'fk_shantytown_comment_id', { transaction }),
            queryInterface.removeConstraint('shantytown_comment_tags', 'fk_comment_tags_uid', { transaction }),
        ]);
        await queryInterface.dropTable('shantytown_comment_tags', { transaction });

        return transaction.commit();
    },
};
