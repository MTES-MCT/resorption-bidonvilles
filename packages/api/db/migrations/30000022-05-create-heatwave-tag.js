module.exports = {
    up: queryInterface => queryInterface.bulkInsert(
        'comment_tags',
        [
            {
                uid: 'canicule',
                tag: 'Canicule',
                fk_comment_tag_type: 'regular',
            },
        ],
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM comment_tags WHERE uid = \'canicule\'',
    ),
};
