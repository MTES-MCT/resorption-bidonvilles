import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        etp_types.uid AS uid,
        etp_types.name AS name
    FROM etp_types`,
    {
        type: QueryTypes.SELECT,
    },
);
