import mails from '#server/mails/mails';
import userModel from '#server/models/userModel';
import answerModel from '#server/models/answerModel';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';

// types
import ServiceError from '#server/errors/ServiceError';
import Answer from '#server/models/answerModel/Answer.d';
import Question from '#server/models/questionModel/Question.d';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';

type AnswerData = {
    description: string,
};

export type CreateAnswerServiceResponse = {
    answer: Answer,
    subscribed: boolean,
};

export default async (answer: AnswerData, question: Question, author: SerializedUser): Promise<CreateAnswerServiceResponse> => {
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

    // On essaie d'envoyer un mail de notification à aux abonnés de la question
    try {
        const subscribers = await userModel.getQuestionSubscribers(question.id);
        await Promise.all(
            subscribers.map((subscriber) => {
                if (author.id === subscriber.user_id) {
                    return null;
                }

                if (subscriber.is_author) {
                    return mails.sendCommunityNewAnswerForAuthor(subscriber, {
                        preserveRecipient: false,
                        variables: {
                            questionId: question.id,
                            author,
                        },
                    });
                }

                return mails.sendCommunityNewAnswerForObservers(subscriber, {
                    preserveRecipient: false,
                    variables: {
                        questionId: question.id,
                        question: question.question,
                        author,
                    },
                });
            }),
        );
    } catch (error) {
        // ignore
    }

    // on essaie d'abonner l'auteur de la réponse à la question
    let subscribed: boolean = false;
    try {
        if (author.question_subscriptions[question.id] === undefined) {
            await userQuestionSubscriptionModel.createSubscription(author.id, question.id);
            subscribed = true;
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

    return {
        answer: serializedAnswer,
        subscribed,
    };
};
