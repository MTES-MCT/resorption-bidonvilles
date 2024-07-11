import { Transaction } from 'sequelize';
import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';
import { EnrichedQuestion } from '#root/types/resources/QuestionEnriched.d';
import { RawQuestion } from '#root/types/resources/QuestionRaw.d';
import enrichQuestion from './common/enrichQuestion';

export default async (transaction?: Transaction): Promise<EnrichedQuestion[]> => {
    let questions: RawQuestion[];
    let enrichedQuestions: EnrichedQuestion[] = [];
    try {
        questions = await questionModel.findAll();
        if (questions.length > 0) {
            enrichedQuestions = await Promise.all(questions.map(async (question) => {
                const enrichedQuestion = enrichQuestion(question.id, transaction);
                return enrichedQuestion;
            }));
        }
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (questions.length === 0) {
        return [];
    }

    return enrichedQuestions;
};
