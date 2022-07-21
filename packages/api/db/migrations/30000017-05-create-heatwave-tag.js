module.exports = {
    up: queryInterface => queryInterface.bulkInsert(
        'comment_tags',
        [
            {
                uid: 'heatwave',
                tag: 'Canicule',
                fk_comment_tag_type: 'regular',
            },
        ],
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM comment_tags WHERE uid = \'heatwave\'',
    ),
};
