import answerModel from '#server/models/answerModel';
import ServiceError from '#server/errors/ServiceError';

export default async (answer, question, author) => {
    // on insère la réponse
    let answerId;
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
    let serializedAnswer;
    try {
        serializedAnswer = await answerModel.findOne(answerId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return serializedAnswer;
};
