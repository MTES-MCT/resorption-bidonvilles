import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import Answer from './Answer.d';
import AnswerRow from './AnswerRow.d';
import serializeAnswer from './_common/serializeAnswer';

export default async (id: number): Promise<Answer | null> => {
    const rows: AnswerRow[] = await sequelize.query(
        `
        SELECT
            ca.answer_id AS "answerId",
            ca.fk_question AS "questionId",
            ca.description AS "answerDescription",
            ca.created_at AS "answerCreatedAt",
            ca.created_by "answerCreatedBy",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            rr.name AS "userRole",
            o.organization_id AS "organizationId",
            o.name AS "organizationName",
            o.abbreviation AS "organizationAbbreviation"
        FROM
            answers ca
        LEFT JOIN
            users u ON ca.created_by = u.user_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN
            roles_regular rr ON u.fk_role_regular = rr.role_id
        WHERE
            ca.answer_id = :id`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    if (rows.length !== 1) {
        return null;
    }

    return serializeAnswer(rows[0]);
};