import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import { UpdateQuestionInput } from './QuestionInput.d';
import type { QuestionUpdatedBy } from '#root/types/resources/QuestionUpdatedBy.d';
import type { UpdatedQuestion } from '#root/types/resources/UpdatedQuestion';


export default async (data: UpdateQuestionInput): Promise<UpdatedQuestion> => {
    const transaction = await sequelize.transaction();

    let updateResult:Array<any> = [];
    let updatedQuestion:UpdatedQuestion;
    try {
        updateResult = await sequelize.query(
            `UPDATE questions SET
            details = :details,
            updated_at = NOW(),
            updated_by = :updated_by
        WHERE question_id = :question_id
        RETURNING question_id as id, details, updated_at as updatedAt, updated_by as updatedBy`,
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
        updatedQuestion = {
            id: updateResult[0][0].id,
            details: updateResult[0][0].details,
            updatedAt: updateResult[0][0].updatedat,
            updatedBy: { id: updateResult[0][0].updatedby },
        };
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('question_update_error', error);
    }

    let userUpdating:Array<QuestionUpdatedBy> = [];
    try {
        userUpdating = await sequelize.query(
            `SELECT
                first_name,
                last_name,
                fk_role as role,
                position,
                jsonb_build_object(
                    'id', o.organization_id,
                    'name', o.name,
                    'abbreviation', o.abbreviation
                ) as organization
            FROM users u
            LEFT JOIN organizations o
            ON u.fk_organization = o.organization_id WHERE u.user_id = :updated_by`,
            {
                type: QueryTypes.SELECT,
                transaction,
                replacements: {
                    updated_by: data.updated_by,
                },
            },
        );
        updatedQuestion = {
            ...updatedQuestion,
            updatedBy: { ...updatedQuestion.updatedBy, ...userUpdating[0] },
        };
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('question_update_error', error);
    }

    await transaction.commit();

    return updatedQuestion;
};
