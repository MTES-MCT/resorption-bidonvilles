import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';
import { Answer } from '#root/types/resources/Answer.d';
import { Question } from '#root/types/resources/Question.d';

export default async (questionId: number): Promise<Question> => {
    let question: Question;
    let answers: { [key: number]: Answer[] };
    try {
        question = await questionModel.findOne(questionId);
        answers = await questionModel.getAnswers([questionId]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (question === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver la question en base de données'));
    }

    if (answers[questionId] !== undefined) {
        question.answers = answers[questionId];
    }

    return question;
};
