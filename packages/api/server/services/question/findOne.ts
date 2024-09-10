import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import enrichQuestion from '#server/services/question/common/enrichQuestion';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';

export default async (questionId: number, transaction?: Transaction): Promise<EnrichedQuestion> => {
    let enrichedQuestion: EnrichedQuestion | null = null;

    try {
        enrichedQuestion = await enrichQuestion(questionId, transaction);

        if (enrichedQuestion === null) {
                throw new ServiceError('fetch_failed', new Error('Impossible de retrouver la question en base de données'));
        }
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return enrichedQuestion;
};
