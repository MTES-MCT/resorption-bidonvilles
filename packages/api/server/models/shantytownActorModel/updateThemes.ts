const sequelize = require('#db/sequelize');
const processThemes = require('./_common/processThemes');

module.exports = (shantytownId, userId, themes, updatedBy, transaction = undefined) => {
    const replacements = {
        ...processThemes(themes),
        fk_shantytown: shantytownId,
        fk_user: userId,
        updated_by: updatedBy,
    };

    return sequelize.query(
        `UPDATE shantytown_actors
            SET
                themes = ARRAY[${replacements.themes.map(id => `'${id}'`).join(',')}]::enum_shantytown_actors_themes[],
                autre = :autre,
                updated_by = :updated_by
            WHERE fk_shantytown = :fk_shantytown AND fk_user = :fk_user`,
        {
            replacements,
            transaction,
        },
    );
};
