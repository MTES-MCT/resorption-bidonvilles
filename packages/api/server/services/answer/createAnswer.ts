import mails from '#server/mails/mails';
import userModel from '#server/models/userModel';
import answerModel from '#server/models/answerModel';
import serializeAttachment from '#server/services/attachment/serializeAttachment';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';
import uploadAttachments from '#server/services/attachment/upload';
import scanAttachmentErrors from '#server/services/attachment/scanAttachmentErrors';
import { sequelize } from '#db/sequelize';

// types
import ServiceError from '#server/errors/ServiceError';
import { RawAnswer } from '#root/types/resources/AnswerRaw.d';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';
import { User } from '#root/types/resources/User.d';
import { EnrichedAnswer } from '#root/types/resources/AnswerEnriched.d';

type AnswerData = {
    description: string,
};

export type CreateAnswerServiceResponse = {
    answer: EnrichedAnswer,
    subscribed: boolean,
};

export default async (answer: AnswerData, question: EnrichedQuestion, author: User, files: Express.Multer.File[]): Promise<CreateAnswerServiceResponse> => {
    // on démarre une transaction
    const transaction = await sequelize.transaction();

    // on insère la réponse
    let answerId: number;
    try {
        answerId = await answerModel.create({
            description: answer.description,
            fk_question: question.id,
            created_by: author.id,
        }, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }

    if (files.length > 0) {
        try {
            await uploadAttachments('answer', answerId, author.id, files, transaction);
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError(error?.message ?? '500', scanAttachmentErrors[error?.message].message ?? 'upload_failed');
        }
    }

    let serializedAnswer: RawAnswer;
    let enrichedAnswer: EnrichedAnswer | null = null;
    try {
        serializedAnswer = await answerModel.findOne(answerId, transaction);

        if (serializedAnswer.attachments && serializedAnswer.attachments.length > 0) {
            const { attachments: answerAttachments, ...answerWithoutAttachments } = serializedAnswer;
            const enrichedAnswerAttachments = files.length > 0 ? await Promise.all((answerAttachments).map(attachment => serializeAttachment(attachment))) : [];
            enrichedAnswer = {
                ...answerWithoutAttachments,
                attachments: enrichedAnswerAttachments,
            };
        } else {
            enrichedAnswer = {
                ...serializedAnswer,
                attachments: [],
            };
        }
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('fetch_failed', error);
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', error);
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
        // eslint-disable-next-line no-console
        console.error(error);
    }

    // on essaie d'abonner l'auteur de la réponse à la question
    let subscribed: boolean = false;
    try {
        if (author.question_subscriptions[question.id] === undefined) {
            await userQuestionSubscriptionModel.createSubscription(author.id, question.id);
            subscribed = true;
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return {
        answer: enrichedAnswer,
        subscribed,
    };
};
