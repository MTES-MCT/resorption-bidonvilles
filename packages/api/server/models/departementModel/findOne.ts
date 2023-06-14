import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type DepartementRawData = {
    code: string,
    name: string,
    latitude: number,
    longitude: number,
    region: string,
    chief_town_latitude : number,
    chief_town_longitude: number
};
export default async (code):Promise<DepartementRawData> => {
    const departement: DepartementRawData[] = await sequelize.query(
        `SELECT
            departements.code AS code,
            departements.name AS name,
            departements.latitude,
            departements.longitude,
            departements.fk_region AS region,
            city_chief_towns.latitude AS chief_town_latitude,
            city_chief_towns.longitude AS chief_town_longitude
        FROM departements
        LEFT JOIN cities AS city_chief_towns ON city_chief_towns.code = departements.fk_city
        WHERE departements.code = :code`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                code,
            },
        },
    );

    return departement.length > 0 ? departement[0] : null;
};
