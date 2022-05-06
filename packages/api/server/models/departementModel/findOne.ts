import { sequelize } from '#db/sequelize';

export default async (code) => {
    const departement = await sequelize.query(
        `SELECT
            departements.code AS code,
            departements.name AS name
        FROM departements
        WHERE code = :code`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                code,
            },
        },
    );

    return departement.length > 0 ? departement[0] : null;
};
