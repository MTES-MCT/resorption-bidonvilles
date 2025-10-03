import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import dateUtils from '#server/utils/date';
import { RawChangelog } from './getChangelogFor.d';
import { Changelog } from '#root/types/resources/Changelog.d';
import { User } from '#root/types/resources/User.d';

const { toFormat } = dateUtils;

function serializeChangelog(changelogItem: RawChangelog): Changelog {
    const [year, month, date] = changelogItem.date.split('-');

    return {
        app_version: changelogItem.app_version,
        date: toFormat(new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10)), 'd M Y'),
        title: changelogItem.title,
        description: changelogItem.description,
        image: changelogItem.image,
    };
}

export default async (user: User): Promise<Changelog[]> => {
    if (user.last_changelog === null || user.last_version === null) {
        return [];
    }

    const changelog: RawChangelog[] = await sequelize.query(
        `SELECT
            changelogs.app_version,
            changelogs.date,
            items.title,
            items.description,
            items.image
        FROM changelogs
        LEFT JOIN changelog_items AS items ON items.fk_changelog = changelogs.app_version
        WHERE
            regexp_split_to_array(changelogs.app_version, '\\.')::int[] > regexp_split_to_array(:minVersion, '\\.')::int[]
            AND
            regexp_split_to_array(changelogs.app_version, '\\.')::int[] <= regexp_split_to_array(:maxVersion, '\\.')::int[]
            AND
            CURRENT_DATE <= (changelogs.date::date + INTERVAL '2 months')
        ORDER BY regexp_split_to_array(changelogs.app_version, '\\.')::int[] ASC, items.position ASC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                minVersion: user.last_changelog,
                maxVersion: user.last_version,
            },
        },
    );

    if (changelog.length === 0) {
        return [];
    }

    return changelog.map(serializeChangelog);
};
