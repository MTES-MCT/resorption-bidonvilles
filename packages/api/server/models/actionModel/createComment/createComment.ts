import { type Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

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

    const promises = [];

    if (comment.targets?.users && comment.targets.users.length > 0) {
        promises.push(
            sequelize.getQueryInterface().bulkInsert(
                'action_comment_user_targets',
                comment.targets.users.map(user => ({
                    fk_user: user.id,
                    fk_comment: action_comment_id,
                })),
                { transaction },
            ),
        );
    }

    if (comment.targets?.organizations && comment.targets.organizations.length > 0) {
        promises.push(
            sequelize.getQueryInterface().bulkInsert(
                'action_comment_organization_targets',
                comment.targets.organizations.map(organization => ({
                    fk_organization: organization.id,
                    fk_comment: action_comment_id,
                })),
                { transaction },
            ),
        );
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }

    return action_comment_id;
}
