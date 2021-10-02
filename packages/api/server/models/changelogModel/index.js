const { toFormat } = require('#server/utils/date');

/**
 * Serializes a changelog
 *
 * @param {Object} changelog
 *
 * @returns {Object}
 */
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

module.exports = database => ({
    getChangelogFor: async (user) => {
        if (user.last_changelog === null || user.last_version === null) {
            return [];
        }

        const changelog = await database.query(
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
                type: database.QueryTypes.SELECT,
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
    },

    getLastChangelogVersion: async () => {
        const changelogs = await database.query(
            `SELECT
                changelogs.app_version
            FROM changelogs
            ORDER BY regexp_split_to_array(changelogs.app_version, '\\.')::int[] DESC
            LIMIT 1`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        if (changelogs.length === 0) {
            return '0.0.0';
        }

        return changelogs[0].app_version;
    },
});
