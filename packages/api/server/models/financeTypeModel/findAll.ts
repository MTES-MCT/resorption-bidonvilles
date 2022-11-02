import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        finance_types.uid AS uid,
        finance_types.name AS name
    FROM finance_types`,
    {
        type: QueryTypes.SELECT,
    },
);
