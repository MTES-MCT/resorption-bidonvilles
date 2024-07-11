import { Transaction } from 'sequelize';
import serializeAttachment from '#server/services/attachment/serializeAttachment';
import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';
import { RawQuestion } from '#root/types/resources/QuestionRaw.d';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';
import { EnrichedAnswer } from '#root/types/resources/AnswerEnriched.d';
import { RawAnswer } from '#root/types/resources/AnswerRaw.d';

export default async (questionId: number, transaction?: Transaction): Promise<EnrichedQuestion> => {
    try {
        let enrichedQuestion: EnrichedQuestion | null = null;
        const question: RawQuestion = await questionModel.findOne(questionId, transaction);

        const { attachments, ...questionWithoutAttachments } = question;
        const enrichedAttachments = await Promise.all((attachments || []).map(attachment => serializeAttachment(attachment)));

        enrichedQuestion = {
            ...questionWithoutAttachments,
            attachments: enrichedAttachments,
        };

        const answers: { [key: number]: RawAnswer[] } = await questionModel.getAnswers([questionId]);
        let enrichedAnswers: EnrichedAnswer[] = [];
        if (answers[questionId].length > 0) {
            const rawAnswers = answers[questionId];
            enrichedAnswers = await Promise.all(rawAnswers.map(async (answer) => {
                const { attachments: answerAttachments, ...answerWithoutAttachments } = answer;
                const enrichedAnswerAttachments = await Promise.all((answerAttachments || []).map(attachment => serializeAttachment(attachment)));
                return {
                    ...answerWithoutAttachments,
                    attachments: enrichedAnswerAttachments,
                };
            }));
        }

        if (enrichedQuestion === null) {
            throw new ServiceError('fetch_failed', new Error('Impossible de retrouver la question en base de données'));
        }

        if (answers[questionId] !== undefined) {
            enrichedQuestion.answers = enrichedAnswers;
        }
        return enrichedQuestion;
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
