import { QueryTypes, type Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export type ActionCommentInsertionRow = {
    description: string,
    created_by: number,
};

export default async (actionId: number, comment: ActionCommentInsertionRow, transaction?: Transaction): Promise<number> => {
    const data = await sequelize.query(
        `INSERT INTO action_comments(fk_action, description, created_by)
        VALUES (:actionId, :description, :created_by)
        RETURNING action_comment_id`,
        {
            type: QueryTypes.INSERT,
            replacements: {
                actionId,
                description: comment.description,
                created_by: comment.created_by,
            },
            transaction,
        },
    );
    type ReturnValue = { action_comment_id: number };
    const rows: ReturnValue[] = (data[0] as unknown) as ReturnValue[];

    return rows[0].action_comment_id;
};
