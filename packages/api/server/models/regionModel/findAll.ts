import { sequelize } from '#db/sequelize';

export default () => sequelize.query(
    `SELECT
        regions.code AS code,
        regions.name AS name
    FROM regions`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
