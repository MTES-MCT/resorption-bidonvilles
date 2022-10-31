import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        regions.code AS code,
        regions.name AS name
    FROM regions`,
    {
        type: QueryTypes.SELECT,
    },
);
