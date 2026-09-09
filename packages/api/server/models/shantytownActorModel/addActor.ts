import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import { ActorTheme } from '#root/types/resources/ShantytownActor.d';
import processThemes from './_common/processThemes';

export default function addActor(shantytownId: number, userId: number, themes: ActorTheme[], createdBy: number, transaction: Transaction | undefined = undefined) {
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
}
