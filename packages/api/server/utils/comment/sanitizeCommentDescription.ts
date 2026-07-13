import { trim } from 'validator';
import ServiceError from '#server/errors/ServiceError';

export default function sanitizeCommentDescription(description: string): string {
    const trimmedDescription = trim(description ?? '');
    if (trimmedDescription === '') {
        throw new ServiceError('data_incomplete', new Error('La description du commentaire ne peut pas être vide'));
    }

    return trimmedDescription;
}
