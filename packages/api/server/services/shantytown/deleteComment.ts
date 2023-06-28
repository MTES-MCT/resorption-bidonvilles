import validator from 'validator';
import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import permissionUtils from '#server/utils/permission';
import dateUtils from '#server/utils/date';
import ServiceError from '#server/errors/ServiceError';
import shantytownCommentAttachmentModel from '#server/models/shantytownCommentAttachmentModel';
import attachmentService from '#server/services/attachment';
import attachmentModel from '#server/models/attachmentModel';
import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import { AttachmentKeys } from '#server/models/attachmentModel/findKeys';

const { fromTsToFormat: tsToString } = dateUtils;

export default async (user, shantytownId, commentId, deletionMessage) => {
    let town: { comments: { regular: any[]; covid: any[]; }; region: any; departement: any; epci: any; city: { name: any; }; usename: any; };
    try {
        town = await shantytownModel.findOne(user, shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const comment = [
        ...town.comments.regular,
        ...town.comments.covid,
    ].find(({ id }) => id === parseInt(commentId, 10));
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', new Error('Le commentaire à supprimer n\'a pas été retrouvé en base de données'));
    }
    let author;
    try {
        author = await userModel.findOne(comment.createdBy.id);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const location = {
        type: 'city',
        region: town.region,
        departement: town.departement,
        epci: town.epci,
        city: town.city,
    };

    const isOwner = author.id === user.id;
    if (!isOwner && !permissionUtils.can(user).do('moderate', 'shantytown_comment').on(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas accès à ces données'));
    }

    let message: string;
    if (!isOwner) {
        message = validator.trim(deletionMessage || '');
        if (message === '') {
            throw new ServiceError('data_incomplete', new Error('Vous devez préciser le motif de suppression du commentaire'));
        }
    }

    const transaction: Transaction = await sequelize.transaction();

    try {
        let deleteCommentPromises: Promise<any>[] = [];

        if (comment.attachments && comment.attachments.length > 0) {
            // On récupère la liste des identifiants d'attachments
            const tab = comment.attachments.map((attachment: { id: number; }) => attachment.id);
            const commentAttachmentIdsPromises = tab.map(async (id: number) => attachmentModel.findKeys(id));
            const commentAttachmentIds = await Promise.all(commentAttachmentIdsPromises);
            // On crée un tableau de promesses pour les suppressions d'attachments
            const deleteAttachmentPromises = commentAttachmentIds.map((attachmentKey: AttachmentKeys) => attachmentService.deleteAttachment(attachmentKey, transaction));
            // On ajoute les promesses de suppressions d'attachments à la liste des promesses à exécuter
            deleteCommentPromises = [
                ...deleteCommentPromises,
                ...deleteAttachmentPromises,
            ];
            // Promesse pour la supression dans shantytown_comment_attachments
            deleteCommentPromises.push(shantytownCommentAttachmentModel.deleteShantytownCommentAttachment(commentId, transaction));
        }
        // Promesse pour la suppression dans shantytown_comments
        deleteCommentPromises.push(shantytownCommentModel.deleteComment(commentId, transaction));
        if (deleteCommentPromises.length > 0) {
            await Promise.all(deleteCommentPromises);
        }
        // Si aucune opération en bdd n'est en échec, on commit
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('delete_failed', error);
    }

    try {
        if (!isOwner) {
            const nationalAdmins = await userModel.getNationalAdmins();
            await mails.sendUserCommentDeletion(author, {
                variables: {
                    town: {
                        usename: town.usename,
                        city: {
                            name: town.city.name,
                        },
                    },
                    comment: {
                        description: comment.description,
                        created_at: tsToString(comment.createdAt, 'd/m/Y'),
                    },
                    message,
                },
                bcc: nationalAdmins,
            });
        }
        return {
            comments: {
                regular: town.comments.regular.filter(({ id }) => id !== parseInt(commentId, 10)),
                covid: town.comments.covid.filter(({ id }) => id !== parseInt(commentId, 10)),
            },
        };
    } catch (error) {
        return {
            comments: {
                regular: town.comments.regular,
                covid: town.comments.covid,
            },
        };
    }
};
