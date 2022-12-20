import { sequelize } from '#db/sequelize';
import questionModel from '#server/models/questionModel';
import { QueryTypes } from 'sequelize';

export default async (id) => {
    const rows = await sequelize.query(
        `
        SELECT
            ca.communaute_answer_id AS "answerId",
            ca.description AS "answerDescription",
            ca.fk_question AS "questionId",
            ca.created_at AS "answerCreatedAt",
            ca.created_by "answerCreatedBy",
            u.user_id AS "userId",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            rr.name AS "userRole",
            o.organization_id AS "organizationId",
            o.name AS "organizationName",
            o.abbreviation AS "organizationAbbreviation"
        FROM
            communaute_answers ca
        LEFT JOIN
            users u ON ca.created_by = u.user_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN
            roles_regular rr ON u.fk_role_regular = rr.role_id
        WHERE
            pc.plan_comment_id = :id`,
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

    return questionModel.serializeQuestion(rows[0]);
};
