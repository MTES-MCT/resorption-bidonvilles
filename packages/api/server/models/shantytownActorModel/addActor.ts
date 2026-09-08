import { sequelize } from '#db/sequelize';
import processThemes from './_common/processThemes';

export default (shantytownId, userId, themes, createdBy, transaction = undefined) => {
    const processedThemes = processThemes(themes);

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
            $shantytownId,
            $userId,
            $themes::enum_shantytown_actors_themes[],
            $autre,
            $createdBy
        )`, {
            bind: {
                shantytownId,
                userId,
                themes: processedThemes.themes,
                autre: processedThemes.autre,
                createdBy,
            },
            transaction,
        },
    );
};
