const { sequelize } = require('#db/models');
const decomposeForDiagramm = require('./_common/decomposeForDiagramm');
const getArrayOfDates = require('./_common/getArrayOfDates');
const { restrict } = require('#server/utils/permission');
const { fromGeoLevelToTableName } = require('#server/utils/geo');

const joins = [
    { table: 'cities', on: 'shantytowns.fk_city = cities.code' },
    { table: 'epci', on: 'cities.fk_epci = epci.code' },
    { table: 'departements', on: 'cities.fk_departement = departements.code' },
    { table: 'regions', on: 'departements.fk_region = regions.code' },
];


module.exports = async (user, location) => {
    const where = [];
    const replacements = {
    };
    const restrictedLocation = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocation === null) {
        return null;
    }

    if (restrictedLocation.type !== 'nation') {
        where.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.code = :shantytownLocationCode`);
        replacements.shantytownLocationCode = restrictedLocation[restrictedLocation.type].code;
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
            shantytowns.shantytown_id as id
        FROM 
            (
                (
                    SELECT shantytowns.updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school 
                    FROM shantytowns
                    ${joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                )
                UNION
                (
                    SELECT shantytowns.updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school 
                    FROM "ShantytownHistories" shantytowns
                    ${joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                )
            ) shantytowns
        ORDER BY shantytowns.updated_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    const users = await sequelize.query(
        `SELECT 
            created_at
        FROM users
        WHERE fk_status = 'active'
        ORDER BY created_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );
    const listOfDates = getArrayOfDates(otherDate, date);
    const stats = decomposeForDiagramm(shantytownStats, users, listOfDates);
    return stats;
};
