import { sequelize } from '#db/sequelize';

export default () => sequelize.query(
    `SELECT
        etp_types.uid AS uid,
        etp_types.name AS name
    FROM etp_types`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
