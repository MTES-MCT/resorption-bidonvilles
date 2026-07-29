import ServiceError from '#server/errors/ServiceError';

interface UpdateCommentCallbacks<TComment> {
    fetchComments: () => Promise<TComment[]>;
    findComment: (comments: TComment[], commentId: number) => TComment | undefined;
    assertIsOwner: (comment: TComment, userId: number) => void;
    sanitizeDescription: (description: string) => string;
    persistUpdate: (trimmedDescription: string) => Promise<{ length: number } | any[]>;
}

export default async function runUpdateComment<TComment>(
    userId: number,
    commentId: number,
    description: string,
    callbacks: UpdateCommentCallbacks<TComment>,
): Promise<void> {
    let comments: TComment[];
    try {
        comments = await callbacks.fetchComments();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const comment = callbacks.findComment(comments, commentId);
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', new Error('Le commentaire à modifier n\'a pas été retrouvé en base de données'));
    }

    callbacks.assertIsOwner(comment, userId);

    const trimmedDescription = callbacks.sanitizeDescription(description);

    let updatedRows: { length: number } | any[];
    try {
        updatedRows = await callbacks.persistUpdate(trimmedDescription);
    } catch (error) {
        throw new ServiceError('update_failed', error);
    }

    if (updatedRows.length === 0) {
        throw new ServiceError('permission_denied', new Error('Seul l\'auteur peut modifier son commentaire (contrôle base de données)'));
    }
}
