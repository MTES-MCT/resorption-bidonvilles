const { sequelize } = require('#db/models');
const userModel = require('#server/models/userModel')();
const updateWhereClauseForPermissions = require('#server/models/common/updateWhereClauseForPermissions');

module.exports = async (userLocation, permissions, location, locationType, locationCode, numberActivities, lastDate) => {
    // apply geographic level restrictions
    const where = [];
    const replacements = {};
    const limit = `limit ${numberActivities}`;
    updateWhereClauseForPermissions({
        permissions,
        permission: 'covid_comment.list',
        requestedLocation: location,
        userLocation,
        whereFn: (loc) => {
            if (!loc) {
                where.push('false');
                return;
            }

            if (loc.type === 'nation') {
                return;
            }

            switch (loc.type) {
                case 'region':
                    where.push('departements.fk_region = :locationCode');
                    replacements.locationCode = loc.region.code;
                    break;

                case 'departement':
                case 'epci':
                case 'city':
                    where.push('departements.code = :locationCode');
                    replacements.locationCode = loc.departement.code;
                    break;

                default:
            }
        },
    });
    const whereLastDate = `${where.length > 0 ? 'AND' : 'WHERE'} comments.created_at < '${lastDate}'`;
    const activities = await sequelize.query(
        `
            SELECT DISTINCT
                comments.high_covid_comment_id AS "highCommentId",
                comments.created_at AS "date",
                author.first_name AS author_first_name,
                author.last_name AS author_last_name,
                author.fk_organization AS author_organization,
                comments.description AS description,
                departements.name AS "highCommentDptName",
                departements.code AS "highCommentDptCode"
            FROM high_covid_comments comments
            LEFT JOIN users author ON comments.created_by = author.user_id
            LEFT JOIN high_covid_comment_territories territories ON territories.fk_comment = comments.high_covid_comment_id
            LEFT JOIN departements ON territories.fk_departement = departements.code
            LEFT JOIN regions ON departements.fk_region = regions.code
            LEFT JOIN cities ON cities.fk_departement = departements.code
            LEFT JOIN epci ON cities.fk_epci = epci.code
            ${where.length > 0 ? `WHERE (${where.join(') AND (')})` : ''}
            ${whereLastDate}
            ${locationType === 'city' ? `AND cities.code = '${locationCode}'` : ''}
            ${locationType === 'epci' ? `AND epci.code = '${locationCode}'` : ''}
            ${locationType === 'departement' ? `AND departements.code = '${locationCode}'` : ''}
            ${locationType === 'region' ? `AND regions.code = '${locationCode}'` : ''}
            ORDER BY comments.created_at DESC
            ${limit}
            `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    const highCovidComments = {};

    return activities
        .map((activity) => {
            if (highCovidComments[activity.highCommentId] !== undefined) {
                highCovidComments[activity.highCommentId].highCovidComment.departements.push({
                    code: activity.highCommentDptCode,
                    name: activity.highCommentDptName,
                });
                return null;
            }

            const o = {
                entity: 'comment',
                action: 'creation',
                date: activity.date.getTime() / 1000,
                author: {
                    name: userModel.formatName({
                        first_name: activity.author_first_name,
                        last_name: activity.author_last_name,
                    }),
                    organization: activity.author_organization,
                },
                highCovidComment: {
                    description: activity.description,
                    departements: [{
                        code: activity.highCommentDptCode,
                        name: activity.highCommentDptName,
                    }],
                },
            };

            highCovidComments[activity.highCommentId] = o;
            return o;
        })
        .filter(activity => activity !== null);
};
