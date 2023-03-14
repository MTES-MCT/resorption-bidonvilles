import userModel from '#server/models/userModel';
import answerModel from '#server/models/answerModel';
import ServiceError from '#server/errors/ServiceError';
import sendMailForNewAnswer from './_common/sendMailForNewAnswer';

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

    // On essaie d'envoyer un mail de notification à l'auteur de la question
    try {
        const questionAuthor = await userModel.findOne(question.createdBy.id);
        await sendMailForNewAnswer(question.id, author, questionAuthor);
    } catch (ignore) {
        // ignore
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
