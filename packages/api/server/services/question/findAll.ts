import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';

export default async () => {
    let questions;
    let answers;
    try {
        questions = await questionModel.findAll();
        answers = await questionModel.getAnswers(questions.map(({ id }: any) => id));
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (questions.length === 0) {
        return [];
    }


    return questions.map((question: any) => ({
        ...question,
        answers: answers[question.id] || [],
    }));
};
