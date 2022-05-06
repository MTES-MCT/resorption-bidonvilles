import { sequelize } from '#db/sequelize';

export default () => sequelize.query(
    `SELECT
        plan_categories.uid AS uid,
        plan_categories.name AS name
    FROM plan_categories`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
