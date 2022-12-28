import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import answerModel from '#server/models/answerModel';


export default async (questionIds) => {
    const answers = questionIds.reduce((acc, id) => Object.assign({}, acc, {
        [id]: [],
    }), {});


    const rows = await sequelize.query(
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
            organizations.organization_id AS "organizationId",
            organizations.name AS "organizationName",
            organizations.abbreviation AS "organizationAbbreviation"
        FROM answers
        LEFT JOIN users ON answers.created_by = users.user_id
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

    rows.forEach((answer: any) => {
        answers[answer.questionId].push(
            answerModel.serializeAnswer(answer),
        );
    }, {});

    return answers;
};
