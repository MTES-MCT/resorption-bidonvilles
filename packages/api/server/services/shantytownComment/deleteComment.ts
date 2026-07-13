import { trim } from 'validator';
import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import permissionUtils from '#server/utils/permission';
import dateUtils from '#server/utils/date';
import { AuthUser } from '#server/middlewares/authMiddleware';
import runDeleteComment from '#server/utils/comment/runDeleteComment';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';

const { fromTsToFormat: tsToString } = dateUtils;

export default async function deleteComment(user: AuthUser, shantytownId: number, commentId: number, deletionMessage: string): Promise<{ comments: ShantytownEnrichedComment[] }> {
    let town: Shantytown;

    await runDeleteComment<Shantytown, ShantytownRawComment>(
        user.id,
        deletionMessage,
        {
            fetchEntity: async () => {
                town = await shantytownModel.findOne(user, shantytownId);
                return town;
            },
            findComment: shantytown => shantytown.comments.find(({ id }) => id === commentId),
            fetchAuthor: authorId => userModel.findOne(authorId),
            buildLocation: shantytown => ({
                type: 'city',
                region: shantytown.region,
                departement: shantytown.departement,
                epci: shantytown.epci,
                city: shantytown.city,
            }),
            checkPermission: location => permissionUtils.can(user).do('moderate', 'data').on(location),
            sanitizeDeletionMessage: message => trim(message ?? ''),
            persistDelete: () => shantytownCommentModel.deleteComment(commentId),
            buildMailVariables: (shantytown, comment, message) => ({
                entity: {
                    type: 'le site',
                    name: shantytown.usename,
                    location: {
                        name: shantytown.city.name,
                    },
                },
                comment: {
                    description: comment.description,
                    created_at: tsToString(comment.createdAt, 'd/m/Y'),
                },
                message,
            }),
            sendMail: async (author, mailVariables, nationalAdmins) => {
                if (author.status === 'active') {
                    await mails.sendUserCommentDeletion(author, {
                        variables: mailVariables,
                        bcc: nationalAdmins,
                    });
                } else {
                    await Promise.all(nationalAdmins.map(async nationalAdmin => mails.sendAdminCommentDeletion(nationalAdmin, {
                        variables: mailVariables,
                        preserveRecipient: false,
                    })));
                }
            },
            getNationalAdmins: () => userModel.getNationalAdmins(),
        },
    );

    let commentsWithEnrichedAttachments: ShantytownEnrichedComment[] = [];
    try {
        const rawComments: ShantytownRawComment[] = town.comments.filter(({ id }) => id !== commentId);
        commentsWithEnrichedAttachments = await Promise.all(rawComments.map(async rawComment => enrichCommentsAttachments(rawComment)));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return {
        comments: commentsWithEnrichedAttachments,
    };
}
