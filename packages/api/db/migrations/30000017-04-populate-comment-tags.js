module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
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
        )
            .then(() => queryInterface.bulkInsert(
                'comment_tags',
                [
                    {
                        uid: 'living_conditions',
                        tag: 'Conditions de vie',
                        fk_comment_tag_type: 'regular',
                    },
                    {
                        uid: 'socialAssistance',
                        tag: 'Accompagnement social',
                        fk_comment_tag_type: 'regular',
                    },
                    {
                        uid: 'populationDisplacement',
                        tag: 'Déplacement de populations',
                        fk_comment_tag_type: 'regular',
                    },
                    {
                        uid: 'fire',
                        tag: 'Incendie',
                        fk_comment_tag_type: 'regular',
                    },
                    {
                        uid: 'onSiteVisit',
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
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM comment_tags',
            { transaction },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM comment_tag_types',
                { transaction },
            )),
    ),

};
