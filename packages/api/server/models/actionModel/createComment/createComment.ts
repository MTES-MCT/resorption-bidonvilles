import { type Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { insertCommentTargets } from '#server/utils/comment/insertCommentTargets';

type ActionCommentTarget = {
    id: number,
};

export type ActionCommentTargets = {
    mode: 'public' | 'pref_et_ddets' | 'custom',
    organizations: ActionCommentTarget[],
    users: ActionCommentTarget[],
};

export type ActionCommentInsertionRow = {
    description: string,
    created_by: number,
    targets?: ActionCommentTargets,
};

export default async function createComment(actionId: number, comment: ActionCommentInsertionRow, transaction?: Transaction): Promise<number> {
    const [rows] = await sequelize.query(
        `INSERT INTO action_comments(fk_action, description, created_by)
        VALUES (:actionId, :description, :created_by)
        RETURNING action_comment_id`,
        {
            replacements: {
                actionId,
                description: comment.description,
                created_by: comment.created_by,
            },
            transaction,
        },
    ) as [[{ action_comment_id: number }], unknown];

    const { action_comment_id } = rows[0];

    if (comment.targets) {
        await insertCommentTargets(
            action_comment_id,
            comment.targets,
            {
                userTargetsTable: 'action_comment_user_targets',
                organizationTargetsTable: 'action_comment_organization_targets',
            },
            transaction,
        );
    }

    return action_comment_id;
}
