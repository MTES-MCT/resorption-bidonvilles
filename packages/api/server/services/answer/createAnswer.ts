import userModel from '#server/models/userModel';
import answerModel from '#server/models/answerModel';
import ServiceError from '#server/errors/ServiceError';
import Answer from '#server/models/answerModel/Answer.d';
import Question from '#server/models/questionModel/Question.d';
import { SerializedUser } from '#server/models/userModel/_common/serializeUser';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';
import sendMailForNewAnswer from './_common/sendMailForNewAnswer';

type AnswerData = {
    description: string,
};

export default async (answer: AnswerData, question: Question, author: SerializedUser): Promise<Answer> => {
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

    // On essaie d'envoyer un mail de notification à l'auteur de la question
    try {
        const questionAuthor = await userModel.findOne(question.createdBy.id);
        if (questionAuthor.email_subscriptions.includes('community_new_answer')) {
            await sendMailForNewAnswer(question.id, author, questionAuthor);
        }
    } catch (ignore) {
        // ignore
    }

    // on essaie d'abonner l'auteur de la réponse à la question
    try {
        if (author.question_subscriptions[question.id] === undefined) {
            await userQuestionSubscriptionModel.createSubscription(author.id, question.id);
        }
    } catch (error) {
        // ignore
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
