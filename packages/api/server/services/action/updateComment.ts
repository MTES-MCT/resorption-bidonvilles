import validator from 'validator';
import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
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
    // Récupération de l'action
    let actions: Action[];
    try {
        actions = await actionModel.fetch(user, [actionId]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // Vérification que le commentaire existe
    const comment: Comment = actions[0].comments.find(({ id }) => id === Number.parseInt(commentId.toString(), 10));
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', new Error('Le commentaire à modifier n\'a pas été retrouvé en base de données'));
    }

    // Vérification que l'utilisateur est l'auteur
    const isOwner: boolean = comment.createdBy.id === user.id;
    if (!isOwner) {
        throw new ServiceError('permission_denied', new Error('Seul l\'auteur peut modifier son commentaire'));
    }

    // Validation de la description
    const trimmedDescription = validator.trim(description ?? '');
    if (trimmedDescription === '') {
        throw new ServiceError('data_incomplete', new Error('La description du commentaire ne peut pas être vide'));
    }

    // Mise à jour du commentaire
    try {
        await actionModel.updateComment(commentId, user.id, trimmedDescription);
    } catch (error) {
        throw new ServiceError('update_failed', error);
    }

    // Récupération de la liste mise à jour des commentaires
    let updatedActions: Action[];
    try {
        updatedActions = await actionModel.fetch(user, [actionId]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // Récupération du commentaire mis à jour
    const updatedComment = updatedActions[0].comments.find(({ id }) => id === Number.parseInt(commentId.toString(), 10));

    // Enrichissement avec les pièces jointes
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
