import { sequelize } from '#db/sequelize';
import userModelFactory from '#server/models/userModel';
import permissionUtils from '#server/utils/permission';

const userModel = userModelFactory();
const { restrict } = permissionUtils;

type Replacements = {
    maxDate?: Date,
    locationCode?: string,
};

export default async (user, location, numberOfActivities, lastDate, maxDate) => {
    // apply geographic level restrictions
    const where = [];
    const replacements: Replacements = {
        maxDate,
    };
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';

    const restrictedLocation = restrict(location).for(user).askingTo('list', 'covid_comment');
    if (restrictedLocation === null) {
        return [];
    }

    if (restrictedLocation.type === 'region') {
        where.push('departements.fk_region = :locationCode');
        replacements.locationCode = restrictedLocation.region.code;
    } else if (restrictedLocation.type !== 'nation') {
        where.push('departements.code = :locationCode');
        replacements.locationCode = restrictedLocation.departement.code;
    }

    where.push(`comments.created_at < '${lastDate}'`);
    if (maxDate) {
        where.push('comments.created_at >= :maxDate');
    }

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
