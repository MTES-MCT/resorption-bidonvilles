import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { SocialOrigin } from '#root/types/resources/SocialOrigin.d';

export default (): Promise<SocialOrigin[]> => sequelize.query(
    `SELECT
        social_origins.social_origin_id AS id,
        social_origins.uid AS uid,
        social_origins.label AS label
    FROM social_origins`,
    {
        type: QueryTypes.SELECT,
    },
);
