import { type Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export type ActionCommentInsertionRow = {
    description: string,
    created_by: number,
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

    return action_comment_id;
}
