import { sequelize } from '#db/sequelize';
import processThemes from './_common/processThemes';

export default (shantytownId, userId, themes, createdBy, transaction = undefined) => {
    const replacements = {
        ...processThemes(themes),
        fk_shantytown: shantytownId,
        fk_user: userId,
        created_by: createdBy,
    };

    return sequelize.query(
        `INSERT INTO shantytown_actors
            (
                fk_shantytown,
                fk_user,
                themes,
                autre,
                created_by
            )
        VALUES (
            :fk_shantytown,
            :fk_user,
            ARRAY[${replacements.themes.map(id => `'${id}'`).join(',')}]::enum_shantytown_actors_themes[],
            :autre,
            :created_by
        )`, {
            replacements,
            transaction,
        },
    );
};
