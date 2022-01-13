const { sequelize } = require('#db/models');
const formatName = require('./_common/formatName');

module.exports = async (locationType, locationCode, numberOfActivities, lastDate) => {
    const limit = numberOfActivities !== '-1' ? `limit ${numberOfActivities}` : '';
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
                ${locationType === 'city' ? `AND organizations.city_code = '${locationCode}'` : ''}
                ${locationType === 'epci' ? `AND organizations.epci_code = '${locationCode}'` : ''}
                ${locationType === 'departement' ? `AND organizations.departement_code = '${locationCode}'` : ''}
                ${locationType === 'region' ? `AND organizations.region_code = '${locationCode}'` : ''}
            ORDER BY lua.used_at DESC
            ${limit}
            `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return activities
        .map(activity => ({
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
