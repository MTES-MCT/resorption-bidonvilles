import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import enrichQuestion from '#server/services/question/common/enrichQuestion';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';

export default async (questionId: number, transaction?: Transaction): Promise<EnrichedQuestion> => {
    let enrichedQuestion: Promise<EnrichedQuestion> | null = null;

    try {
        enrichedQuestion = enrichQuestion(questionId, transaction);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return enrichedQuestion;
};
