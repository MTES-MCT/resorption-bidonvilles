import answerModel from '#server/models/answerModel';
import ServiceError from '#server/errors/ServiceError';
import Answer from '#server/models/answerModel/Answer.d';

type AnswerData = {
    description: string,
};

type QuestionData = {
    id: number,
};

type AuthorData = {
    id: number,
};

export default async (answer: AnswerData, question: QuestionData, author: AuthorData): Promise<Answer> => {
    // on insère la réponse
    let answerId: number;
    try {
        answerId = await answerModel.create({
            description: answer.description,
            fk_question: question.id,
            created_by: author.id,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne la réponse
    let serializedAnswer: Answer;
    try {
        serializedAnswer = await answerModel.findOne(answerId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return serializedAnswer;
};