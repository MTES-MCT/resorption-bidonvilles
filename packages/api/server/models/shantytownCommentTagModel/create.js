const sequelize = require('#db/sequelize');

module.exports = async (commentId, commentTagId) => sequelize.transaction(async (transaction) => {
    // comment
    await sequelize.query(
        `INSERT INTO
                shantytown_comment_tags(
                    fk_shantytown_comment,
                    fk_comment_tag
                )
                
            VALUES
                (
                    :commentId,
                    :commentTagId
                )`,
        {
            replacements: {
                commentId,
                commentTagId,
            },
            transaction,
        },
    );
});
