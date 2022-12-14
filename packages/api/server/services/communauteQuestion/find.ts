import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';

export default async (questionId) => {
    const question = await questionModel.findOne(questionId);
    if (question === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver la question en base de données'));
    }
    return question;
};
