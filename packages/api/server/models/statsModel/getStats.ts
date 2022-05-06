import { sequelize } from '#db/sequelize';
import permissionUtils from '#server/utils/permission';
import geoUtils from '#server/utils/geo';
import decomposeForDiagramm from './_common/decomposeForDiagramm';
import getArrayOfDates from './_common/getArrayOfDates';

const { restrict } = permissionUtils;
const { fromGeoLevelToTableName } = geoUtils;

const joins = [
    { table: 'cities', on: 'shantytowns.fk_city = cities.code' },
    { table: 'epci', on: 'cities.fk_epci = epci.code' },
    { table: 'departements', on: 'cities.fk_departement = departements.code' },
    { table: 'regions', on: 'departements.fk_region = regions.code' },
];


export default async (user, location) => {
    const restrictedLocation = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocation === null) {
        return null;
    }

    let where = '';
    switch (location.type) {
        case 'nation':
            break;
        case 'region':
            where = `AND lo.region_code = '${location.region.code}'`;
            break;
        default:
            where = `AND lo.departement_code = '${location.departement.code}'`;
            break;
    }

    const date = new Date();
    const otherDate = new Date();
    otherDate.setMonth(date.getMonth() - 3);
    const shantytownStats = await sequelize.query(
        `SELECT 
            population_total as population,
            population_minors as minors,
            minors_in_school,
            shantytowns.updated_at,
            shantytowns.closed_at,
            resorbed,
            ${restrictedLocation.type !== 'nation' ? 'code,' : '0 as code,'}
            shantytowns.shantytown_id as id
        FROM 
            (
                (
                    SELECT shantytowns.updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school${restrictedLocation.type !== 'nation' ? `, ${fromGeoLevelToTableName(restrictedLocation.type)}.code` : ''}
                    FROM shantytowns
                    ${joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                )
                UNION
                (
                    SELECT shantytowns.updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school${restrictedLocation.type !== 'nation' ? `, ${fromGeoLevelToTableName(restrictedLocation.type)}.code` : ''}
                    FROM "ShantytownHistories" shantytowns
                    ${joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                )
            ) shantytowns
        ORDER BY shantytowns.updated_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );
    const users = await sequelize.query(
        `SELECT 
            u.created_at
        FROM users u
        LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
        WHERE u.fk_status = 'active'
        ${where}
        ORDER BY u.created_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );
    const listOfDates = getArrayOfDates(otherDate, date);
    const stats = decomposeForDiagramm(shantytownStats, users, listOfDates, restrictedLocation);
    return stats;
};
