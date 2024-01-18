import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import userModel from '#server/models/userModel';
import permissionUtils from '#server/utils/permission';

import { Location } from '#server/models/geoModel/Location.d';
import { ActionCommentActivity } from '#root/types/resources/Activity.d';
import { User } from '#root/types/resources/User.d';

const { restrict } = permissionUtils;


type ActionCommentHistoryRow = {
    commentId: number,
    date: Date,
    author_first_name: string,
    author_last_name: string,
    author_organization: number,
    description: string,
    action_id: number,
    action_name: string
};
export default async (user: User, location: Location, numberOfActivities: number, lastDate: Date, maxDate: Date): Promise<ActionCommentActivity[]> => {
    // apply geographic level restrictions
    const where = [];
    const replacements: any = {
        maxDate,
    };
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';

    const restrictedLocations = restrict(location).for(user).askingTo('read', 'action_comment');
    if (restrictedLocations.length === 0) {
        return [];
    }

    if (!restrictedLocations.some(l => l.type === 'nation')) {
        where.push(
            restrictedLocations.map((l, index) => {
                if (l.type === 'region') {
                    replacements[`locationCode${index}`] = l.region.code;
                    return `departements.fk_region = :locationCode${index}`;
                }

                replacements[`locationCode${index}`] = l.departement.code;
                return `departements.code = :locationCode${index}`;
            }).join(' OR '),
        );
    }

    where.push(`comments.created_at < '${lastDate}'`);
    if (maxDate) {
        where.push('comments.created_at >= :maxDate');
    }

    const activities = await sequelize.query(
        `
            SELECT DISTINCT
                comments.action_comment_id AS "commentId",
                comments.created_at AS "date",
                author.first_name AS author_first_name,
                author.last_name AS author_last_name,
                author.fk_organization AS author_organization,
                comments.description AS description,
                actions.action_id AS action_id,
                actions.name AS action_name
            FROM action_comments comments
            LEFT JOIN users author ON comments.created_by = author.user_id
            LEFT JOIN actions ON comments.fk_action = actions.action_id
            LEFT JOIN departements ON actions.fk_departement = departements.code
            LEFT JOIN regions ON departements.fk_region = regions.code
            LEFT JOIN cities ON cities.fk_departement = departements.code
            LEFT JOIN epci ON cities.fk_epci = epci.code
            ${where.length > 0 ? `WHERE (${where.join(') AND (')})` : ''}
            ORDER BY comments.created_at DESC
            ${limit}
            `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );

    const actionComments = {};

    return activities
        .map((activity: ActionCommentHistoryRow) => {
            const o: ActionCommentActivity = {
                entity: 'comment',
                action: 'creation',
                date: activity.date.getTime() / 1000,
                actionEntity: {
                    id: activity.action_id,
                    name: activity.action_name,
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

            actionComments[activity.commentId] = o;
            return o;
        });
};
