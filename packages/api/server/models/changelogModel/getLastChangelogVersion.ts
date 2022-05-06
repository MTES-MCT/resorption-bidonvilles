import { sequelize } from '#db/sequelize';

export default async () => {
    const changelogs = await sequelize.query(
        `SELECT
            changelogs.app_version
        FROM changelogs
        ORDER BY regexp_split_to_array(changelogs.app_version, '\\.')::int[] DESC
        LIMIT 1`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    if (changelogs.length === 0) {
        return '0.0.0';
    }

    return changelogs[0].app_version;
};
