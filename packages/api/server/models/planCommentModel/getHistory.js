const sequelize = require('#db/sequelize');
const userModel = require('#server/models/userModel');
const { restrict } = require('#server/utils/permission');

module.exports = async (user, location, numberOfActivities, lastDate, maxDate) => {
    // apply geographic level restrictions
    const where = [];
    const replacements = {
        maxDate,
    };
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';

    const restrictedLocation = restrict(location).for(user).askingTo('list', 'plan_comment');
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
                comments.plan_comment_id AS "commentId",
                comments.created_at AS "date",
                author.first_name AS author_first_name,
                author.last_name AS author_last_name,
                author.fk_organization AS author_organization,
                comments.description AS description,
                plans2.plan_id AS plan_id,
                plans2.name AS plan_name
            FROM plan_comments comments
            LEFT JOIN users author ON comments.created_by = author.user_id
            LEFT JOIN plans2 ON comments.fk_plan = plans2.plan_id
            LEFT JOIN plan_departements ON plan_departements.fk_plan = comments.fk_plan
            LEFT JOIN departements ON plan_departements.fk_departement = departements.code
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

    const planComments = {};

    return activities
        .map((activity) => {
            const o = {
                entity: 'comment',
                action: 'creation',
                date: activity.date.getTime() / 1000,
                plan: {
                    id: activity.plan_id,
                    name: activity.plan_name,
                },
                author: {
                    name: userModel.formatName({
                        first_name: activity.author_first_name,
                        last_name: activity.author_last_name,
                    }),
                    organization: activity.author_organization,
                },
                comment: {
                    tags: [],
                    user_target_name: [],
                    organization_target_name: [],
                    description: activity.description,
                },
            };

            planComments[activity.commentId] = o;
            return o;
        });
};
