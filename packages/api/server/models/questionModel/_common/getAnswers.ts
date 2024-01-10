import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import answerModel from '#server/models/answerModel';
import AnswerRow from '#server/models/answerModel/AnswerRow.d';
import { Answer } from '#root/types/resources/Answer.d';

type AnswerHash = {
    [key: number]: Answer[],
};

export default async (questionIds: number[]): Promise<AnswerHash> => {
    if (questionIds.length === 0) {
        return {};
    }

    const answers: AnswerHash = questionIds.reduce((acc, id) => Object.assign(acc, {
        [id]: [],
    }), {});

    const rows: AnswerRow[] = await sequelize.query(
        `
        SELECT
            answers.answer_id AS "answerId",
            answers.fk_question AS "questionId",
            answers.description AS "answerDescription",
            answers.created_at AS "answerCreatedAt",
            answers.created_by AS "answerCreatedBy",
            users.first_name AS "userFirstName",
            users.last_name AS "userLastName",
            users.position AS "userPosition",
            roles_regular.name AS "userRole",
            organizations.organization_id AS "organizationId",
            organizations.name AS "organizationName",
            organizations.abbreviation AS "organizationAbbreviation"
        FROM answers
        LEFT JOIN users ON answers.created_by = users.user_id
        LEFT JOIN roles_regular ON users.fk_role_regular = roles_regular.role_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        WHERE
            answers.fk_question IN (:ids) 
        ORDER BY answers.created_at DESC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ids: questionIds,
            },
        },
    );

    rows.forEach((answer) => {
        answers[answer.questionId].push(
            answerModel.serializeAnswer(answer),
        );
    }, {});

    return answers;
};
