import { sequelize } from '#db/sequelize';

export default async (uid) => {
    const result = await sequelize.query(
        `SELECT
            uid,
            name_singular,
            name_plural
        FROM organization_categories
        WHERE uid = :uid`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                uid,
            },
        },
    );

    return result.length === 1 ? result[0] : null;
};
