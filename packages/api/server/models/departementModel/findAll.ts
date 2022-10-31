import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        departements.code AS code,
        departements.name AS name,
        departements.fk_region AS region
    FROM departements
    ORDER BY code ASC`,
    {
        type: QueryTypes.SELECT,
    },
);
