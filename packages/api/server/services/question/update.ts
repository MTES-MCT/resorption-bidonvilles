import ServiceError from '#server/errors/ServiceError';
import update from '#server/models/questionModel/update';
import { UpdateQuestionInput } from '#server/models/questionModel/QuestionInput.d';
import type { RawQuestion } from '#root/types/resources/QuestionRaw.d';

export default async (questionId: number, question: UpdateQuestionInput, author: number): Promise<RawQuestion> => {
    let questionResult: RawQuestion;
    try {
        questionResult = await update(
            {
                question_id: questionId,
                question: question.question,
                tags: question.tags,
                other_tag: question.other_tag,
                people_affected: question.people_affected,
                details: question.details,
                updated_by: author,
            },
        );
    } catch (error) {
        throw new ServiceError('question_update_failed', error);
    }

    return questionResult;
};
