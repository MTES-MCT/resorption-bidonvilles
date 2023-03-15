import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';
import Question from '#server/models/questionModel/Question.d';
import Answer from '#server/models/answerModel/Answer.d';

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
