import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        uid,
        name_singular,
        name_plural
    FROM organization_categories`,
    {
        type: QueryTypes.SELECT,
    },
);
