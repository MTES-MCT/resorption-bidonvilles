import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentTagModel from '#server/models/shantytownCommentTagModel/index';

import { ShantytownCommentRow } from './ShantytownCommentRow';

const { serializeComment } = shantytownModel;

/**
 * @param {Number} id A shantytown_comment_id
 */
export default async (id) => {
    const [comments, commentTags] = await Promise.all([
        <Promise<ShantytownCommentRow[]>>sequelize.query(
            `WITH organization_comment_access AS (
                SELECT
                    scot.fk_comment AS shantytown_comment_id,
                    ARRAY_AGG(o.name) AS organization_target_name,
                    ARRAY_AGG(o.organization_id) AS organization_target_id
                FROM shantytown_comment_organization_targets scot 
                LEFT JOIN organizations o ON o.organization_id = scot.fk_organization
                GROUP BY scot.fk_comment
             ),
             user_comment_access AS (
                SELECT 
                    scut.fk_comment AS shantytown_comment_id,
                    ARRAY_AGG(CONCAT(users.first_name, ' ', users.last_name)) AS user_target_name,
                    ARRAY_AGG(users.user_id) AS user_target_id
                FROM shantytown_comment_user_targets scut 
                LEFT JOIN users ON users.user_id = scut.fk_user
                GROUP BY scut.fk_comment
            )

            SELECT
                sc.shantytown_comment_id AS "commentId",
                sc.description AS "commentDescription",
                sc.fk_shantytown AS "shantytownId",
                sc.created_at AS "commentCreatedAt",
                sc.created_by "commentCreatedBy",
                u.first_name AS "userFirstName",
                u.last_name AS "userLastName",
                u.position AS "userPosition",
                o.abbreviation AS "organizationAbbreviation",
                o.name AS "organizationName",
                o.organization_id AS "organizationId",
                oca.organization_target_name,
                uca.user_target_name
            FROM shantytown_comments sc
            LEFT JOIN users u ON sc.created_by = u.user_id
            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
            LEFT JOIN organization_comment_access oca ON sc.shantytown_comment_id = oca.shantytown_comment_id
            LEFT JOIN user_comment_access uca ON sc.shantytown_comment_id = uca.shantytown_comment_id
            WHERE sc.shantytown_comment_id = :id`,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    id,
                },
            },
        ),
        shantytownCommentTagModel.getTagsForComments([id]),
    ]);

    if (comments.length !== 1) {
        return null;
    }

    return serializeComment({
        ...comments[0],
        tags: commentTags[id] || [],
    });
};
