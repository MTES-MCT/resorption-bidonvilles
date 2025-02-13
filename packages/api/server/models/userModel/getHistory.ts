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
    organization_name: string,
    organization_abbreviation: string,
    is_national: boolean,
    regions: string[],
    departements: string[],
    epci: string[],
    cities: string[],
};

export default async (location: Location, numberOfActivities: number, lastDate: Date, maxDate: Date):Promise<UserActivity[]> => {
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';
    try {
        const activitiess: UserActivityRow[] = await sequelize.query(
            `
            SELECT
                lua.used_at AS "date",
                users.user_id,
                users.first_name,
                users.last_name,
                users.use_custom_intervention_area,
                users.fk_organization AS organization_id,
                organizations.name AS organization_name,
                organizations.abbreviation AS organization_abbreviation,
                v_user_areas.is_national,
                v_user_areas.regions,
                v_user_areas.departements,
                v_user_areas.epci,
                v_user_areas.cities
            FROM last_user_accesses lua
            LEFT JOIN users ON lua.fk_user = users.user_id
            LEFT JOIN organizations ON organizations.organization_id = users.fk_organization 
            LEFT JOIN v_user_areas ON v_user_areas.user_id = users.user_id AND v_user_areas.is_main_area IS TRUE
            WHERE
                lua.used_at IS NOT NULL
                AND lua.used_at < '${lastDate}'
                ${maxDate ? 'AND lua.used_at >= :maxDate' : ''}
                ${location.type === 'city' ? 'AND :city = ANY(v_user_areas.cities)' : ''}
                ${location.type === 'epci' ? 'AND :epci = ANY(v_user_areas.epci)' : ''}
                ${location.type === 'departement' ? 'AND :departement = ANY(v_user_areas.departements)' : ''}
                ${location.type === 'region' ? 'AND :region = ANY(v_user_areas.regions)' : ''}
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
        console.log('activities', activitiess);
    } catch (error) {
        console.log(error);
    }
    const activities: UserActivityRow[] = [];
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
                organizationName: activity.organization_name,
                organizationAbbreviation: activity.organization_abbreviation,
                intervention_areas: {
                    is_national: activity.is_national,
                    areas: (hashInterventionAreas.users[activity.user_id] || []).concat(
                        activity.use_custom_intervention_area !== true ? hashInterventionAreas.organizations[activity.organization_id] || [] : [],
                    ).map(interventionAreaModel.serialize),
                },
            },
        }));
};
