import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        plan_categories.uid AS uid,
        plan_categories.name AS name
    FROM plan_categories`,
    {
        type: QueryTypes.SELECT,
    },
);
