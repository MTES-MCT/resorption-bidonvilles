import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import serializeAnswer from './_common/serializeAnswer';

export default async () => {
    const rows = await sequelize.query(
        `
        SELECT
            ca.answer_id AS "answerId",
            ca.description AS "answerDescription",
            ca.fk_question AS "questionId",
            ca.created_at AS "commentCreatedAt",
            ca.created_by "commentCreatedBy",
            u.user_id AS "userId",
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
            roles_regular rr ON u.fk_role_regular = rr.role_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        `,
        {
            type: QueryTypes.SELECT,
        },
    );
    return rows.map(serializeAnswer);
};
