import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { RawAnswer } from '#root/types/resources/AnswerRaw.d';
import AnswerRow from './AnswerRow.d';

import serializeAnswer from './_common/serializeAnswer';

export default async (): Promise<RawAnswer[]> => {
    const rows: AnswerRow[] = await sequelize.query(
        `WITH grouped_attachments AS (
            SELECT
                aa.fk_answer,
                array_remove(array_agg(
                    a.attachment_id || '@.;.@'
                    || a.original_file_key || '@.;.@'
                    || COALESCE(a.preview_file_key, '') || '@.;.@'
                    || a.original_name || '@.;.@'
                    || a.mimetype || '@.;.@'
                    || a.size || '@.;.@'
                    || a.created_by
                ), null) AS attachments
            FROM answer_attachments aa
            LEFT JOIN attachments a ON aa.fk_attachment = a.attachment_id
            GROUP BY aa.fk_answer
        )
        SELECT
            ca.answer_id AS "answerId",
            ca.fk_question AS "questionId",
            ca.description AS "answerDescription",
            ca.created_at AS "answerCreatedAt",
            ca.created_by "answerCreatedBy",
            u.email AS "userEmail",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            rr.name AS "userRole",
            o.organization_id AS "organizationId",
            o.name AS "organizationName",
            o.abbreviation AS "organizationAbbreviation",
            ga.attachments AS "attachments"
        FROM
            answers ca
        LEFT JOIN
            users u ON ca.created_by = u.user_id
        LEFT JOIN
            roles_regular rr ON u.fk_role_regular = rr.role_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN
            grouped_attachments ga ON ga.fk_answer = ca.answer_id
        ORDER BY ca.created_at DESC
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows.map(serializeAnswer);
};
