import ServiceError from '#server/errors/ServiceError';
import questionModel from '#server/models/questionModel';
import QuestionInput from '#server/models/questionModel/QuestionInput.d';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import config from '#server/config';
import { sequelize } from '#db/sequelize';
import userQuestionSubscriptionModel from '#server/models/userQuestionSubscriptionModel';
import uploadAttachments from '#server/services/attachment/upload';
import scanAttachmentErrors from '#server/services/attachment/scanAttachmentErrors';
import enrichQuestion from '#server/services/question/common/enrichQuestion';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';

type AuthorData = {
    id: number,
};

const { testEmail } = config;

export default async (question: QuestionInput, author: AuthorData, files: Express.Multer.File[]): Promise<EnrichedQuestion> => {
    const transaction = await sequelize.transaction();
    let questionId: number;

    try {
        questionId = await questionModel.create({
            question: question.question,
            details: question.details,
            people_affected: question.people_affected,
            tags: question.tags,
            other_tag: question.other_tag || null,
            created_by: author.id,
        }, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }

    // on sauvegarde les fichiers
    if (files.length > 0) {
        try {
            await uploadAttachments('question', questionId, author.id, files, transaction);
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError(error?.message ?? '500', scanAttachmentErrors[error?.message].message ?? 'upload_failed');
        }
    }

    // on retourne la question
    let enrichedQuestion: EnrichedQuestion | null = null;

    try {
        enrichedQuestion = await enrichQuestion(questionId, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('fetch_failed', error);
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }

    // on insère l'abonnement pour l'auteur de la question
    try {
        await userQuestionSubscriptionModel.createSubscription(author.id, questionId);
    } catch (error) {
        // ignore
    }

    // on notifie tous les utilisateurs concernés
    try {
        const watchers = await userModel.getQuestionWatchers(author.id);
        await Promise.all(
            (testEmail ? watchers.slice(0, 1) : watchers).map(watcher => mails.sendCommunityNewQuestion(watcher, {
                preserveRecipient: false,
                variables: {
                    question: enrichedQuestion,
                },
            })),
        );
    } catch (error) {
        // ignore
    }

    return enrichedQuestion;
};
