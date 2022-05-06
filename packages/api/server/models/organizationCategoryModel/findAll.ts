import { sequelize } from '#db/sequelize';

export default () => sequelize.query(
    `SELECT
        uid,
        name_singular,
        name_plural
    FROM organization_categories`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
