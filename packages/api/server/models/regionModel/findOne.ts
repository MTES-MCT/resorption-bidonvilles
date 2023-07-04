import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';


export type RegionRawData = {
    code: string,
    name: string,
    latitude: number,
    longitude: number,
    chief_town_latitude : number,
    chief_town_longitude: number
};
export default async (code):Promise<RegionRawData> => {
    const region: RegionRawData[] = await sequelize.query(
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
