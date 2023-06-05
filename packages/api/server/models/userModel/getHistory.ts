import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { LocationType } from '#server/models/geoModel/LocationType.d';
import { UserActivity } from '#root/types/resources/Activity.d';
import formatName from './_common/formatName';


type UserActivityRow = {
    date: Date,
    first_name: string,
    last_name: string,
    organization_id: number,
    location_type: LocationType,
    region_code: string | null,
    region_name: string | null,
    departement_code: string | null,
    departement_name: string | null,
    epci_code: string | null,
    epci_name: string | null,
    city_code: string | null,
    city_name: string | null,
    city_main: string | null
};

export default async (location, numberOfActivities, lastDate, maxDate):Promise<UserActivity[]> => {
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';
    const activities = await sequelize.query(
        `
            SELECT
                lua.used_at AS "date",
                users.first_name,
                users.last_name,
                organizations.organization_id,
                organizations.location_type,
                organizations.region_code,
                organizations.region_name,
                organizations.departement_code,
                organizations.departement_name,
                organizations.epci_code,
                organizations.epci_name,
                organizations.city_code,
                organizations.city_name,
                organizations.city_main
            FROM last_user_accesses lua
            LEFT JOIN users ON lua.fk_user = users.user_id
            LEFT JOIN localized_organizations organizations ON users.fk_organization = organizations.organization_id
            WHERE
                lua.used_at IS NOT NULL
                AND lua.used_at < '${lastDate}'
                ${maxDate ? 'AND lua.used_at >= :maxDate' : ''}
                ${location.type === 'city' ? `AND organizations.city_code = '${location.city.code}'` : ''}
                ${location.type === 'epci' ? `AND organizations.epci_code = '${location.epci.code}'` : ''}
                ${location.type === 'departement' ? `AND organizations.departement_code = '${location.departement.code}'` : ''}
                ${location.type === 'region' ? `AND organizations.region_code = '${location.region.code}'` : ''}
            ORDER BY lua.used_at DESC
            ${limit}
            `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                maxDate,
            },
        },
    );

    return activities
        .map((activity: UserActivityRow): UserActivity => ({
            entity: 'user',
            action: 'creation',
            date: activity.date.getTime() / 1000,
            user: {
                name: formatName(activity),
                organization: activity.organization_id,
                location: {
                    type: activity.location_type,
                    region: activity.region_code !== null ? {
                        code: activity.region_code,
                        name: activity.region_name,
                    } : null,
                    departement: activity.departement_code !== null ? {
                        code: activity.departement_code,
                        name: activity.departement_name,
                    } : null,
                    epci: activity.epci_code !== null ? {
                        code: activity.epci_code,
                        name: activity.epci_name,
                    } : null,
                    city: activity.city_code !== null ? {
                        code: activity.city_code,
                        name: activity.city_name,
                        main: activity.city_main,
                    } : null,
                },
            },
        }));
};
