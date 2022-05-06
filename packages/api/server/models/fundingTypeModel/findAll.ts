import { sequelize } from '#db/sequelize';

export default () => sequelize.query(
    `SELECT
        funding_types.funding_type_id AS id,
        funding_types.label AS label
    FROM funding_types`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
