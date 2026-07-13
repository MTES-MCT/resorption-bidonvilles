import ServiceError from '#server/errors/ServiceError';
import { Location } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';

interface DeleteCommentCallbacks<TEntity, TComment> {
    fetchEntity: () => Promise<TEntity>;
    findComment: (entity: TEntity) => TComment | undefined;
    fetchAuthor: (authorId: number) => Promise<User>;
    buildLocation: (entity: TEntity) => Location;
    checkPermission: (location: Location) => boolean;
    sanitizeDeletionMessage: (message: string) => string;
    persistDelete: () => Promise<void>;
    buildMailVariables: (entity: TEntity, comment: TComment, message: string) => { [key: string]: any };
    sendMail: (author: User, mailVariables: { [key: string]: any }, nationalAdmins: User[]) => Promise<void>;
    getNationalAdmins: () => Promise<User[]>;
}

export default async function runDeleteComment<TEntity, TComment extends { createdBy: { id: number }; description: string; createdAt: number | Date }>(
    userId: number,
    deletionMessage: string,
    callbacks: DeleteCommentCallbacks<TEntity, TComment>,
): Promise<void> {
    let entity: TEntity;
    try {
        entity = await callbacks.fetchEntity();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const comment = callbacks.findComment(entity);
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', new Error('Le commentaire à supprimer n\'a pas été retrouvé en base de données'));
    }

    let author: User;
    try {
        author = await callbacks.fetchAuthor(comment.createdBy.id);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const location = callbacks.buildLocation(entity);

    const isOwner = author.id === userId;
    if (!isOwner && !callbacks.checkPermission(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas accès à ces données'));
    }

    let message: string;
    if (!isOwner) {
        message = callbacks.sanitizeDeletionMessage(deletionMessage);
        if (message === '') {
            throw new ServiceError('data_incomplete', new Error('Vous devez préciser le motif de suppression du commentaire'));
        }
    }

    try {
        await callbacks.persistDelete();
    } catch (error) {
        throw new ServiceError('delete_failed', error);
    }

    try {
        if (!isOwner) {
            const nationalAdmins = await callbacks.getNationalAdmins();
            const mailVariables = callbacks.buildMailVariables(entity, comment, message);
            await callbacks.sendMail(author, mailVariables, nationalAdmins);
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
}
