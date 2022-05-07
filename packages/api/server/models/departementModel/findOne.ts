import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (code) => {
    const departement = await sequelize.query(
        `SELECT
            departements.code AS code,
            departements.name AS name
        FROM departements
        WHERE code = :code`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                code,
            },
        },
    );

    return departement.length > 0 ? departement[0] : null;
};
