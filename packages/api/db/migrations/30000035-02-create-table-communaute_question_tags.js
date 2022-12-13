module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.createTable(
            'communaute_question_tags',
            {
                uid: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
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
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        );

        await queryInterface.addConstraint(
            'communaute_question_tags', {
                fields: ['name'],
                type: 'unique',
                name: 'uk_communaute_question_tags_name',
                transaction,
            },
        );

        await queryInterface.bulkInsert(
            'communaute_question_tags',
            [
                {
                    uid: 'health',
                    name: 'Santé',
                },
                {
                    uid: 'school',
                    name: 'Éducation et scolarisation',
                },
                {
                    uid: 'work',
                    name: 'Formation et emploi',
                },
                {
                    uid: 'housing',
                    name: 'Logement',
                },
                {
                    uid: 'safety',
                    name: 'Stabilisation et sécurisation du site',
                },
            ],
            {
                transaction,
            },
        );
        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.removeConstraint(
            'communaute_question_tags',
            'uk_communaute_question_tags_name',
            { transaction },
        );
        await queryInterface.dropTable('communaute_question_tags', { transaction });
        return transaction.commit();
    },
};
