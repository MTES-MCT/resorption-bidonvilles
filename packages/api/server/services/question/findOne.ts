import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';

export default async (questionId) => {
    let question;
    let answers;
    try {
        question = await questionModel.findOne(questionId);
        answers = await questionModel.getAnswers([questionId]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    if (question === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver la question en base de données'));
    }
    return { ...question, answers: answers[questionId] || [] };
};
