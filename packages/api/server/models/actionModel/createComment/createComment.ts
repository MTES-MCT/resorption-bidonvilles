import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';
import fetchComments from '../fetchComments/fetchComments';

import { Comment } from '../fetch/Action';
import serializeComment from '../fetchComments/serializeComment';

export type ActionCommentInsertionRow = {
    description: string,
    created_by: number,
};

export default async (actionId: number, comment: ActionCommentInsertionRow): Promise<Comment> => {
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
        },
    );
    type ReturnValue = { action_comment_id: number };
    const rows: ReturnValue[] = (data[0] as unknown) as ReturnValue[];

    const comments = await fetchComments(null, [rows[0].action_comment_id]);
    return serializeComment(comments[0]);
};
