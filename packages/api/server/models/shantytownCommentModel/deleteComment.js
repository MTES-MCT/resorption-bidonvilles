const {
    sequelize,
} = require('#db/models');

/**
 * @param {Number} id A shantytown_comment_id
 */
module.exports = async (commentId) => {
    await sequelize.query(
        'DELETE FROM shantytown_comments WHERE shantytown_comment_id = :id',
        {
            replacements: {
                id: commentId,
            },
        },
    );
};
