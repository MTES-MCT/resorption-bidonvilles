import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import enrichWhere from '../fetch/enrichWhere';
import { ActionRowComment } from './ActionCommentRow.d';

export default function fetchComments(actionIds: number[] = null, commentIds: number[] = null, clauseGroup: object = {}, transaction?: Transaction): Promise<ActionRowComment[]> {
    const where = [];
    const replacements = {
        actionIds,
        commentIds,
    };
    if (actionIds !== null) {
        where.push('action_comments.fk_action IN (:actionIds)');
    }
    if (commentIds !== null) {
        where.push('action_comments.action_comment_id IN (:commentIds)');
    }

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `
        WITH grouped_attachments AS (
            SELECT
                aca.fk_action_comment,
                array_remove(array_agg(
                    a.attachment_id || '@.;.@'
                    || a.original_file_key || '@.;.@'
                    || COALESCE(a.preview_file_key, '') || '@.;.@'
                    || a.original_name || '@.;.@'
                    || a.mimetype || '@.;.@'
                    || a.size || '@.;.@'
                    || a.created_by
                ), null) AS attachments
            FROM action_comment_attachments aca
            LEFT JOIN attachments a ON aca.fk_attachment = a.attachment_id
            GROUP BY aca.fk_action_comment
        )
        SELECT
            action_comments.fk_action AS action_id,
            action_comments.action_comment_id AS id,
            action_comments.description,
            action_comments.created_at,
            creator.user_id AS creator_id,
            creator.first_name AS creator_first_name,
            creator.last_name AS creator_last_name,
            roles_regular.name AS creator_user_role,
            creator_organizations.organization_id AS creator_organization_id,
            creator_organizations.name AS creator_organization_name,
            creator_organizations.abbreviation AS creator_organization_abbreviation,
            grouped_attachments.attachments AS "attachments"
        FROM action_comments
        LEFT JOIN users AS creator ON action_comments.created_by = creator.user_id
        LEFT JOIN roles_regular ON creator.fk_role_regular = roles_regular.role_id
        LEFT JOIN organizations AS creator_organizations ON creator.fk_organization = creator_organizations.organization_id
        LEFT JOIN actions ON action_comments.fk_action = actions.action_id
        LEFT JOIN departements ON actions.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        LEFT JOIN grouped_attachments ON grouped_attachments.fk_action_comment = action_comments.action_comment_id
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY action_comments.created_at DESC
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
            transaction,
        },
    );
}
