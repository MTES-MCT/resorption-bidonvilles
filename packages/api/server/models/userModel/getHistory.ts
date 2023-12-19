import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Location } from '#server/models/geoModel/Location.d';
import interventionAreaModel from '#server/models/interventionAreaModel';
import { RawInterventionArea } from '#server/models/userModel/_common/query.d';
import { UserActivity } from '#root/types/resources/Activity.d';
import formatName from './_common/formatName';

type UserActivityRow = {
    date: Date,
    user_id: number,
    first_name: string,
    last_name: string,
    use_custom_intervention_area: boolean,
    organization_id: number,
    is_national: boolean,
    regions: string[],
    departements: string[],
    epci: string[],
    cities: string[],
};

export default async (location: Location, numberOfActivities: number, lastDate: Date, maxDate: Date):Promise<UserActivity[]> => {
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';
    const activities: UserActivityRow[] = await sequelize.query(
        `WITH user_intervention_areas AS (
            SELECT
                users.user_id,
                COUNT(CASE WHEN intervention_areas.type = 'nation' THEN 1 ELSE null END) > 0 AS is_national,
                array_remove(array_agg(intervention_areas.fk_region), NULL) AS regions,
                array_remove(array_agg(intervention_areas.fk_departement), NULL) AS departements,
                array_remove(array_agg(intervention_areas.fk_epci), NULL) AS epci,
                array_remove(array_agg(intervention_areas.fk_city), NULL) AS cities
            FROM users
            LEFT JOIN intervention_areas ON (
                users.user_id = intervention_areas.fk_user
                OR (users.use_custom_intervention_area IS FALSE AND users.fk_organization = intervention_areas.fk_organization)
            )
            WHERE intervention_areas.is_main_area IS TRUE
            GROUP BY users.user_id
        )

        SELECT
            lua.used_at AS "date",
            users.user_id,
            users.first_name,
            users.last_name,
            users.use_custom_intervention_area,
            users.fk_organization AS organization_id,
            user_intervention_areas.is_national,
            user_intervention_areas.regions,
            user_intervention_areas.departements,
            user_intervention_areas.epci,
            user_intervention_areas.cities
        FROM last_user_accesses lua
        LEFT JOIN users ON lua.fk_user = users.user_id
        LEFT JOIN user_intervention_areas ON user_intervention_areas.user_id = users.user_id
        WHERE
            lua.used_at IS NOT NULL
            AND lua.used_at < '${lastDate}'
            ${maxDate ? 'AND lua.used_at >= :maxDate' : ''}
            ${location.type === 'city' ? 'AND :city = ANY(user_intervention_areas.cities)' : ''}
            ${location.type === 'epci' ? 'AND :epci = ANY(user_intervention_areas.epci)' : ''}
            ${location.type === 'departement' ? 'AND :departement = ANY(user_intervention_areas.departements)' : ''}
            ${location.type === 'region' ? 'AND :region = ANY(user_intervention_areas.regions)' : ''}
        ORDER BY lua.used_at DESC
        ${limit}
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                maxDate,
                city: location.city?.code || null,
                epci: location.epci?.code || null,
                departement: location.departement?.code || null,
                region: location.region?.code || null,
            },
        },
    );

    const interventionAreas = await interventionAreaModel.list(
        activities.map(({ user_id }) => user_id),
        activities.map(({ organization_id }) => organization_id),
    );

    const hashInterventionAreas = interventionAreas.reduce((acc, row) => {
        const key = row.fk_user !== null ? 'users' : 'organizations';
        const id = row.fk_user !== null ? row.fk_user : row.fk_organization;
        if (acc[key][id] === undefined) {
            acc[key][id] = [];
        }

        acc[key][id].push(row);
        return acc;
    }, {
        users: [],
        organizations: [],
    } as {
        users: { [key: number]: RawInterventionArea[] },
        organizations: { [key: number]: RawInterventionArea[] },
    });

    return activities
        .map((activity): UserActivity => ({
            entity: 'user',
            action: 'creation',
            date: activity.date.getTime() / 1000,
            user: {
                name: formatName(activity),
                organization: activity.organization_id,
                intervention_areas: {
                    is_national: activity.is_national,
                    areas: (hashInterventionAreas.users[activity.user_id] || []).concat(
                        activity.use_custom_intervention_area !== true ? hashInterventionAreas.organizations[activity.organization_id] || [] : [],
                    ).map(interventionAreaModel.serialize),
                },
            },
        }));
};
