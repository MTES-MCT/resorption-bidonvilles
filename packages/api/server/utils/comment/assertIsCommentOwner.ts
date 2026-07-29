import ServiceError from '#server/errors/ServiceError';

export default function assertIsCommentOwner(comment: { createdBy: { id: number } }, userId: number): void {
    if (comment.createdBy.id !== userId) {
        throw new ServiceError('permission_denied', new Error('Seul l\'auteur peut modifier son commentaire'));
    }
}
