import validator from 'validator';
import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { User } from '#root/types/resources/User.d';

import ServiceError from '#server/errors/ServiceError';
import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';
import { AuthUser } from '#server/middlewares/authMiddleware';

import enrichCommentsAttachments from '../shantytown/_common/enrichCommentsAttachments';

export default async function updateComment(commentId: number, shantytownId: number, user: AuthUser, updateMessage: string): Promise<{ comments: ShantytownEnrichedComment[] }> {
    // On récupère le commentaire pour valider que l'utilisateur est l'auteur
    let town: Shantytown;
    try {
        town = await shantytownModel.findOne(user, shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const comment: ShantytownRawComment = town.comments.find(({ id }) => id === commentId);
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', new Error('Le commentaire à modifier n\'a pas été retrouvé en base de données'));
    }

    // On valide que l'utilisateur est bien l'auteur du message
    let author: User;
    try {
        author = await userModel.findOne(comment.createdBy.id);            
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (author?.id !== user.id) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas le droit de modifier ce commentaire'));
    }

    // Vérification du message
     const message = validator.trim(updateMessage ?? '');
     if (message === '') {
            console.log('message vide');
            throw new ServiceError('data_incomplete', new Error('Vous devez préciser le motif de suppression du commentaire'));
     }

     // On procède à la mise à jour du message
     try {
        await shantytownCommentModel.updateComment(commentId, message);
     } catch (error) {
        throw new ServiceError('update_failed', error);
     }

    // on retourne la liste mise à jour des commentaires du site
    let commentsWithEnrichedAttachments: ShantytownEnrichedComment[] = [];
    try {
        const updatedTown = await shantytownModel.findOne(user, shantytownId);
        const rawComments: ShantytownRawComment[] = updatedTown.comments;
        commentsWithEnrichedAttachments = await Promise.all(rawComments.map(async rawComment => enrichCommentsAttachments(rawComment)));
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    
    return {
        comments: commentsWithEnrichedAttachments,
    };
}