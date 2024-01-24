import ServiceError from '#server/errors/ServiceError';
import deleteQuestion from '#server/models/questionModel/delete';

export default async (id:number): Promise<void> => {
    try {
        await deleteQuestion(id);
    } catch (error) {
        throw new ServiceError('delete_failed', error);
    }
};
