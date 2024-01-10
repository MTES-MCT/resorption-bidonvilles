import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Region } from '#root/types/resources/Region.d';

export default (): Promise<Region[]> => sequelize.query(
    `SELECT
        regions.code AS code,
        regions.name AS name
    FROM regions`,
    {
        type: QueryTypes.SELECT,
    },
);
