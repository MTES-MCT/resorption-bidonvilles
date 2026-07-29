import { trim } from 'validator';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';
import assertIsCommentOwner from '#server/utils/comment/assertIsCommentOwner';
import runUpdateComment from '#server/utils/comment/runUpdateComment';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';
import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';

export default async function updateComment(
    user: AuthUser,
    shantytownId: number,
    commentId: number,
    description: string,
): Promise<{ comments: ShantytownEnrichedComment[], numberOfWatchers: number }> {
    await runUpdateComment<ShantytownRawComment>(
        user.id,
        commentId,
        description,
        {
            fetchComments: async () => {
                const commentsObject = await shantytownCommentModel.findByShantytown(user, [shantytownId.toString()]);
                return commentsObject[shantytownId] || [];
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
            persistUpdate: async trimmedDescription => shantytownCommentModel.update(commentId, user.id, trimmedDescription),
        },
    );

    let updatedCommentsObject;
    try {
        updatedCommentsObject = await shantytownCommentModel.findByShantytown(user, [shantytownId.toString()]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const rawComments = updatedCommentsObject[shantytownId] || [];

    let commentsWithEnrichedAttachments: ShantytownEnrichedComment[] = [];
    try {
        commentsWithEnrichedAttachments = await Promise.all(rawComments.map(async rawComment => enrichCommentsAttachments(rawComment)));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    let numberOfWatchers = 0;
    try {
        const watchers = await userModel.getShantytownWatchers(shantytownId);
        numberOfWatchers = watchers.length;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return {
        comments: commentsWithEnrichedAttachments,
        numberOfWatchers,
    };
}
