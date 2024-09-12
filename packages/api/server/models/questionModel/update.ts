import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import { UpdateQuestionInput } from './QuestionInput.d';
import type { RawQuestion } from '#root/types/resources/QuestionRaw';
import findOne from './findOne';


export default async (data: UpdateQuestionInput): Promise<RawQuestion> => {
    const transaction = await sequelize.transaction();
    let updatedQuestion: RawQuestion;
    try {
        await sequelize.query(
            `UPDATE questions SET
            details = :details,
            updated_at = NOW(),
            updated_by = :updated_by
        WHERE question_id = :question_id`,
            {
                type: QueryTypes.UPDATE,
                transaction,
                replacements: {
                    question_id: data.question_id,
                    details: data.details,
                    updated_by: data.updated_by,
                },
            },
        );
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('question_update_error', error);
    }

    try {
        updatedQuestion = await findOne(data.question_id, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('question_fetch_error', error);
    }

    await transaction.commit();

    return updatedQuestion;
};
