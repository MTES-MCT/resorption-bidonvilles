const sequelize = require('#db/sequelize');
const { toFormat } = require('#server/utils/date');

function serializeChangelog(changelogItem) {
    const [year, month, date] = changelogItem.date.split('-');

    return {
        app_version: changelogItem.app_version,
        date: toFormat(new Date(year, parseInt(month, 10) - 1, date), 'd M Y'),
        title: changelogItem.title,
        description: changelogItem.description,
        image: changelogItem.image,
    };
}

module.exports = async (user) => {
    if (user.last_changelog === null || user.last_version === null) {
        return [];
    }

    const changelog = await sequelize.query(
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
        ORDER BY regexp_split_to_array(changelogs.app_version, '\\.')::int[] ASC, items.position ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
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
