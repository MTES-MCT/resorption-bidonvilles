import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        social_origins.social_origin_id AS id,
        social_origins.label AS label
    FROM social_origins`,
    {
        type: QueryTypes.SELECT,
    },
);
