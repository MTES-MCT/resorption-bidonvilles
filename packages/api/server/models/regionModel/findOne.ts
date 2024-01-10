import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { RawRegion } from './findOne.d';

export default async (code: string): Promise<RawRegion> => {
    const region: RawRegion[] = await sequelize.query(
        `SELECT
            regions.code AS code,
            regions.name AS name,
            regions.latitude,
            regions.longitude,
            city_chief_towns.latitude AS chief_town_latitude,
            city_chief_towns.longitude AS chief_town_longitude
        FROM regions
        LEFT JOIN cities AS city_chief_towns ON city_chief_towns.code = regions.fk_city
        WHERE regions.code = :code`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                code,
            },
        },
    );

    return region.length > 0 ? region[0] : null;
};
