import validator from 'validator';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import enrichCommentsAttachments from './enrichCommentsAttachments';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

export default async function updateComment(
    user: AuthUser,
    shantytownId: number,
    commentId: number,
    description: string,
): Promise<{ comments: ShantytownEnrichedComment[], numberOfWatchers: number }> {
    // Récupération des commentaires du site
    let commentsObject;
    try {
        commentsObject = await shantytownCommentModel.findByShantytown(user, [shantytownId.toString()]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const comments = commentsObject[shantytownId] || [];

    // Vérification que le commentaire existe
    const comment = comments.find(({ id }) => id === Number.parseInt(commentId.toString(), 10));
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
    // (la clause WHERE created_by = :userId du modèle sert de garde-fou : seul l'auteur
    // peut effectivement modifier la ligne, même si ce contrôle est déjà fait plus haut)
    let updatedRows: { shantytown_comment_id: number }[];
    try {
        updatedRows = await shantytownCommentModel.update(commentId, user.id, trimmedDescription);
    } catch (error) {
        throw new ServiceError('update_failed', error);
    }
    if (updatedRows.length === 0) {
        throw new ServiceError('permission_denied', new Error('Seul l\'auteur peut modifier son commentaire (contrôle base de données)'));
    }

    // Récupération de la liste mise à jour des commentaires
    let updatedCommentsObject;
    try {
        updatedCommentsObject = await shantytownCommentModel.findByShantytown(user, [shantytownId.toString()]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const rawComments = updatedCommentsObject[shantytownId] || [];

    // Enrichissement des pièces jointes
    let commentsWithEnrichedAttachments: ShantytownEnrichedComment[] = [];
    try {
        commentsWithEnrichedAttachments = await Promise.all(rawComments.map(async rawComment => enrichCommentsAttachments(rawComment)));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    // Récupération du nombre de watchers
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
