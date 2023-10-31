import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';
import { Answer } from '#root/types/resources/Answer.d';
import { Question } from '#root/types/resources/Question.d';

export default async (): Promise<Question[]> => {
    let questions: Question[];
    let answers: { [key: number]: Answer[] };
    try {
        questions = await questionModel.findAll();
        answers = await questionModel.getAnswers(questions.map(({ id }: any) => id));
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (questions.length === 0) {
        return [];
    }

    questions.forEach((question) => {
        if (answers[question.id] !== undefined) {
            // eslint-disable-next-line no-param-reassign
            question.answers = answers[question.id];
        }
    });

    return questions;
};
