import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        action_finance_types.uid AS uid,
        action_finance_types.name AS name
    FROM action_finance_types`,
    {
        type: QueryTypes.SELECT,
    },
);