import { trim } from 'validator';
import actionModel from '#server/models/actionModel';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import permissionUtils from '#server/utils/permission';
import dateUtils from '#server/utils/date';
import deleteCommentFromModel from '#server/models/actionModel/deleteComment/deleteComment';
import runDeleteComment from '#server/utils/comment/runDeleteComment';
import Action, { Comment } from '#root/types/resources/Action.d';
import { ActionRawComment } from '#root/types/resources/ActionCommentRaw.d';
import { ActionEnrichedComment } from '#root/types/resources/ActionCommentEnriched.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';

const { fromTsToFormat: tsToString } = dateUtils;

export default async function deleteComment(user, actionId, commentId, deletionMessage): Promise<{ comments: ActionEnrichedComment[] }> {
    let actions: Action[];

    await runDeleteComment<Action, Comment>(
        user.id,
        deletionMessage,
        {
            fetchEntity: async () => {
                actions = await actionModel.fetch(user, [actionId]);
                return actions[0];
            },
            findComment: action => action.comments.find(({ id }) => id === Number.parseInt(commentId, 10)),
            fetchAuthor: authorId => userModel.findOne(authorId),
            buildLocation: action => ({
                type: 'departement',
                region: action.location.region,
                departement: action.location.departement,
                epci: action.location.epci,
                city: action.location.city,
            }),
            checkPermission: location => permissionUtils.can(user).do('moderate', 'data').on(location),
            sanitizeDeletionMessage: message => trim(message ?? ''),
            persistDelete: () => deleteCommentFromModel(commentId),
            buildMailVariables: (action, comment, message) => ({
                entity: {
                    type: 'l\'action',
                    name: action.name,
                    location: {
                        name: action.location.departement.name,
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
                    await Promise.all(nationalAdmins.map(nationalAdmin => Promise.resolve(
                        mails.sendAdminCommentDeletion(nationalAdmin, {
                            variables: mailVariables,
                            preserveRecipient: false,
                        }),
                    )));
                }
            },
            getNationalAdmins: () => userModel.getNationalAdmins(),
        },
    );

    let commentsWithEnrichedAttachments: ActionEnrichedComment[] = [];
    try {
        const rawComments: ActionRawComment[] = actions[0].comments.filter(({ id }) => id !== Number.parseInt(commentId, 10));
        commentsWithEnrichedAttachments = await Promise.all(rawComments.map(async rawComment => enrichCommentsAttachments(rawComment)));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return {
        comments: commentsWithEnrichedAttachments,
    };
}
