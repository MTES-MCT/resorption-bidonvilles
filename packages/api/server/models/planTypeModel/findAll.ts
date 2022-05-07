import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        plan_types.plan_type_id AS id,
        plan_types.label AS label
    FROM plan_types`,
    {
        type: QueryTypes.SELECT,
    },
);
