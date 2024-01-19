import ServiceError from '#server/errors/ServiceError';
import deleteQuestion from '#server/models/questionModel/delete';

export default async (id:number): Promise<void> => {
    // on supprime la question
    try {
        await deleteQuestion(id);
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }
};
