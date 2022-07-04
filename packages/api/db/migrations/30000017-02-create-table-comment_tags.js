module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'comment_tags',
        {
            uid: {
                type: Sequelize.STRING(50),
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            tag: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },
        },
    ),

    down: queryInterface => queryInterface.dropTable('comment_tag_types'),
};

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        // on crée la table
        transaction => queryInterface.createTable(
            'comment_tags',
            {
                uid: {
                    type: Sequelize.STRING(50),
                    primaryKey: true,
                    allowNull: false,
                    unique: true,
                },
                tag: {
                    type: Sequelize.STRING(150),
                    allowNull: false,
                },
                fk_comment_tag_type: {
                    type: Sequelize.STRING(150),
                    allowNull: false,
                    primaryKey: true,
                },
            },
            { transaction },
        )

            // on crée toutes les contraintes
            .then(() => queryInterface.addConstraint(
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
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        // on supprime toutes les contraintes
        transaction => queryInterface.removeConstraint(
            'comment_tags',
            'fk_comment_tag_types_uid',
            { transaction },
        )

            // on supprime la table
            .then(() => queryInterface.dropTable('comment_tags', { transaction })),
    ),
};
