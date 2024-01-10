import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import serializeQuestion from './serializeQuestion';

import QuestionRow from './QuestionRow';
import { Question } from '#root/types/resources/Question.d';

export default async (): Promise<Question[]> => {
    const rows:QuestionRow[] = await sequelize.query(
        `
        WITH aggregate_question_tags AS (
            SELECT 
                cq.question_id AS id,
                ARRAY_REMOVE(ARRAY_AGG(cqt.uid || '.' || cqt.name), NULL) AS tags
            FROM 
                questions cq
            LEFT JOIN
                question_to_tags cqtt ON cqtt.fk_question = cq.question_id
            LEFT JOIN
                question_tags cqt ON cqt.uid = cqtt.fk_question_tag
            GROUP BY 
                cq.question_id
        )
        SELECT
            cq.question_id AS "questionId",
            cq.question AS "question",
            cq.details AS "details",
            cq.people_affected AS "peopleAffected",
            acqt.tags,
            cq.other_tag,
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
            questions cq
        LEFT JOIN 
            aggregate_question_tags acqt ON acqt.id = cq.question_id
        LEFT JOIN
            users u ON cq.created_by = u.user_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN
            roles_regular rr ON u.fk_role_regular = rr.role_id
        ORDER BY cq.created_at DESC`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows.map(question => serializeQuestion(question));
};
