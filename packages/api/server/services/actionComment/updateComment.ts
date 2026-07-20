import { trim } from 'validator';
import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
import assertIsCommentOwner from '#server/utils/comment/assertIsCommentOwner';
import runUpdateComment from '#server/utils/comment/runUpdateComment';
import Action, { Comment } from '#root/types/resources/Action.d';
import { ActionEnrichedComment } from '#root/types/resources/ActionCommentEnriched.d';
import { User } from '#root/types/resources/User.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';

export default async function updateComment(
    user: User,
    actionId: number,
    commentId: number,
    description: string,
): Promise<{ comment: ActionEnrichedComment }> {
    await runUpdateComment<Comment>(
        user.id,
        commentId,
        description,
        {
            fetchComments: async () => {
                const actions = await actionModel.fetch(user, [actionId]);
                return actions[0].comments;
            },
            findComment: (comments, id) => comments.find(({ id: commentIdInList }) => commentIdInList === Number.parseInt(id.toString(), 10)),
            assertIsOwner: assertIsCommentOwner,
            sanitizeDescription: (desc) => {
                const trimmedDescription = trim(desc ?? '');
                if (trimmedDescription === '') {
                    throw new ServiceError('data_incomplete', new Error('La description du commentaire ne peut pas être vide'));
                }
                return trimmedDescription;
            },
            persistUpdate: async trimmedDescription => actionModel.updateComment(commentId, user.id, trimmedDescription),
        },
    );

    let updatedActions: Action[];
    try {
        updatedActions = await actionModel.fetch(user, [actionId]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const updatedComment = updatedActions[0].comments.find(({ id }) => id === commentId);

    let enrichedComment: ActionEnrichedComment;
    try {
        enrichedComment = await enrichCommentsAttachments(updatedComment);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return {
        comment: enrichedComment,
    };
}
