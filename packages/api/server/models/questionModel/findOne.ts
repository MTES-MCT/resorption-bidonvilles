import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import serializeQuestion from './serializeQuestion';

export default async (id) => {
    const rows = await sequelize.query(
        `
        SELECT
            cq.communaute_question_id AS "questionId",
            cq.question AS "question",
            cq.details AS "details",
            cq.people_affected AS "peopleAffected",
            cq.created_at AS "questionCreatedAt",
            cq.updated_at AS "questionUpdatedAt",
            cq.solved_at AS "questionSolvedAt",
            cq.created_by "questionCreatedBy",
            u.user_id AS "userId",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            rr.name AS "userRole",
            o.organization_id AS "organizationId",
            o.name AS "organizationName",
            o.abbreviation AS "organizationAbbreviation"
        FROM
            communaute_questions cq
        LEFT JOIN
            users u ON cq.created_by = u.user_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN
            roles_regular rr ON u.fk_role_regular = rr.role_id
        WHERE
            cq.communaute_question_id = :id`,
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

    return serializeQuestion(rows[0]);
};
