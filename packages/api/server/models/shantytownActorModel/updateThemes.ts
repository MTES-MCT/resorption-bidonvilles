import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import { ActorTheme } from '#root/types/resources/ShantytownActor.d';
import processThemes from './_common/processThemes';

export default function updateThemes(shantytownId: number, userId: number, themes: ActorTheme[], updatedBy: number, transaction: Transaction | undefined = undefined) {
    const processedThemes = processThemes(themes);

    return sequelize.query(
        `UPDATE shantytown_actors
            SET
                themes = $themes::enum_shantytown_actors_themes[],
                autre = $autre,
                updated_by = $updatedBy
            WHERE fk_shantytown = $shantytownId AND fk_user = $userId`,
        {
            bind: {
                themes: processedThemes.themes,
                autre: processedThemes.autre,
                updatedBy,
                shantytownId,
                userId,
            },
            transaction,
        },
    );
}
