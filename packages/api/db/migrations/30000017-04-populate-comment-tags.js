module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.bulkInsert(
            'comment_tag_types',
            [
                {
                    uid: 'regular',
                    name: 'ordinaire',
                },
                {
                    uid: 'covid19',
                    name: 'COVID-19',
                },
            ],
            { transaction },
        );
        await queryInterface.bulkInsert(
            'comment_tags',
            [
                {
                    uid: 'conditionss_de_vie',
                    tag: 'Conditions de vie',
                    fk_comment_tag_type: 'regular',
                },
                {
                    uid: 'accommpagnement_social',
                    tag: 'Accompagnement social',
                    fk_comment_tag_type: 'regular',
                },
                {
                    uid: 'deplacement_de_populations',
                    tag: 'Déplacement de populations',
                    fk_comment_tag_type: 'regular',
                },
                {
                    uid: 'incendie',
                    tag: 'Incendie',
                    fk_comment_tag_type: 'regular',
                },
                {
                    uid: 'passage_sur_site',
                    tag: 'Passage sur site',
                    fk_comment_tag_type: 'regular',
                },
                {
                    uid: 'covid',
                    tag: 'COVID-19',
                    fk_comment_tag_type: 'covid19',
                },
            ],
            { transaction },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.sequelize.query(
            'DELETE FROM comment_tags',
            { transaction },
        );
        await queryInterface.sequelize.query(
            'DELETE FROM comment_tag_types',
            { transaction },
        );

        return transaction.commit();
    },

};
