const sequelize = require('#db/sequelize');

module.exports = (shantytownId, userId, themeId, updatedBy, transaction = undefined) => {
    let query;
    if (themeId === 'autre') {
        query = 'autre = null';
    } else {
        query = 'themes = array_remove(themes, :themeId)';
    }

    return sequelize.query(
        `UPDATE shantytown_actors
            SET
                ${query},
                updated_by = :updated_by
            WHERE fk_shantytown = :fk_shantytown AND fk_user = :fk_user`,
        {
            replacements: {
                themeId,
                fk_shantytown: shantytownId,
                fk_user: userId,
                updated_by: updatedBy,
            },
            transaction,
        },
    );
};
