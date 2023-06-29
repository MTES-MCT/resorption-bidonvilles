import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import shantytownCommentTagModel from '#server/models/shantytownCommentTagModel/index';
import ShantytownComment from '#server/models/shantytownCommentModel/ShantytownComment.d';
import { CommentTagObject } from '#server/models/shantytownCommentTagModel/getTagsForComments';
import { ShantytownCommentRow } from '../../shantytownCommentModel/ShantytownCommentRow.d';
import serializeComment from './serializeComment';

type CommentObject = { [key: number]: ShantytownComment };

export default async (user, shantytownIds, covid = false): Promise<CommentObject> => {
    if (covid === false && !user.isAllowedTo('list', 'shantytown_comment')) {
        return {};
    }

    const filterPrivateComments = !user.isAllowedTo('listPrivate', 'shantytown_comment');

    const rows: ShantytownCommentRow[] = await sequelize.query(
        `WITH organization_comment_access AS (
            SELECT 
                scot.fk_comment AS shantytown_comment_id,
                ARRAY_AGG(lo.name) AS organization_target_name,
                ARRAY_AGG(lo.organization_id) AS organization_target_id
            FROM shantytown_comment_organization_targets scot 
            LEFT JOIN organizations lo ON lo.organization_id = scot.fk_organization
            GROUP BY scot.fk_comment
        ),
        user_comment_access AS (
            SELECT 
                scut.fk_comment AS shantytown_comment_id,
                ARRAY_AGG(CONCAT(users.first_name, ' ', users.last_name)) AS user_target_name,
                ARRAY_AGG(users.user_id) AS user_target_id
            FROM shantytown_comment_user_targets scut 
            LEFT JOIN users ON users.user_id = scut.fk_user
            GROUP BY scut.fk_comment
        ),
        grouped_attachments AS (
            SELECT
                sca.fk_shantytown_comment,
                array_remove(array_agg(
                    a.attachment_id || '@.;.@'
                    || a.url_original || '@.;.@'
                    || a.url_preview || '@.;.@'
                    || a.original_name || '@.;.@'
                    || a.mimetype || '@.;.@'
                    || a.size || '@.;.@'
                    || a.created_by
                ), null) AS attachments
            FROM shantytown_comment_attachments sca
            LEFT JOIN attachments a ON sca.fk_attachment = a.attachment_id
            GROUP BY sca.fk_shantytown_comment
        )

        SELECT
            shantytown_comments.shantytown_comment_id AS "commentId",
            shantytown_comments.fk_shantytown AS "shantytownId",
            shantytown_comments.description AS "commentDescription",
            shantytown_comments.created_at AS "commentCreatedAt",
            shantytown_comments.created_by AS "commentCreatedBy",
            ${covid === true ? `
                shantytown_covid_comments.date AS "covidCommentDate",
                shantytown_covid_comments.equipe_maraude AS "covidEquipeMaraude",
                shantytown_covid_comments.equipe_sanitaire AS "covidEquipeSanitaire",
                shantytown_covid_comments.equipe_accompagnement AS "covidEquipeAccompagnement",
                shantytown_covid_comments.distribution_alimentaire AS "covidDistributionAlimentaire",
                shantytown_covid_comments.action_mediation_sante as "covidActionMediationSante",
                shantytown_covid_comments.sensibilisation_vaccination as "covidSensibilisationVaccination",
                shantytown_covid_comments.equipe_mobile_depistage as "covidEquipeMobileDepistage",
                shantytown_covid_comments.equipe_mobile_vaccination as "covidEquipeMobileVaccination",
                shantytown_covid_comments.personnes_orientees AS "covidPersonnesOrientees",
                shantytown_covid_comments.personnes_avec_symptomes AS "covidPersonnesAvecSymptomes",
                shantytown_covid_comments.besoin_action AS "covidBesoinAction",`
        : ''}
            users.first_name AS "userFirstName",
            users.last_name AS "userLastName",
            users.position AS "userPosition",
            organizations.organization_id AS "organizationId",
            organizations.name AS "organizationName",
            organizations.abbreviation AS "organizationAbbreviation",
            organization_comment_access.organization_target_name,
            user_comment_access.user_target_name,
            grouped_attachments.attachments AS "attachments"
        FROM shantytown_comments
        LEFT JOIN users ON shantytown_comments.created_by = users.user_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        ${covid === true ? 'INNER JOIN shantytown_covid_comments ON shantytown_covid_comments.fk_comment = shantytown_comments.shantytown_comment_id' : ''}
        LEFT JOIN organization_comment_access ON organization_comment_access.shantytown_comment_id = shantytown_comments.shantytown_comment_id
        LEFT JOIN user_comment_access ON user_comment_access.shantytown_comment_id = shantytown_comments.shantytown_comment_id
        LEFT JOIN grouped_attachments ON grouped_attachments.fk_shantytown_comment = shantytown_comments.shantytown_comment_id
        WHERE
            shantytown_comments.fk_shantytown IN (:ids) 
            ${covid === false ? 'AND shantytown_comments.shantytown_comment_id NOT IN (SELECT fk_comment FROM shantytown_covid_comments)' : ''}
            ${filterPrivateComments === true ? `AND (
                (
                    :userId = ANY(user_comment_access.user_target_id)
                    OR
                    :organizationId = ANY(organization_comment_access.organization_target_id)
                )
                OR
                (
                    user_comment_access.user_target_id IS NULL
                    AND
                    organization_comment_access.organization_target_id IS NULL
                )
                OR (:userId = shantytown_comments.created_by)
            )` : ''}
        ORDER BY shantytown_comments.created_at DESC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ids: shantytownIds,
                userId: user.id,
                organizationId: user.organization.id,
            },
        },
    );

    let commentTags: CommentTagObject = {};
    if (rows.length > 0) {
        commentTags = await shantytownCommentTagModel.getTagsForComments(
            rows.map(({ commentId }: ShantytownCommentRow) => commentId),
        );
    }

    return rows.reduce((acc, row: ShantytownCommentRow) => {
        if (!acc[row.shantytownId]) {
            acc[row.shantytownId] = [];
        }

        acc[row.shantytownId].push(serializeComment({
            ...row,
            tags: commentTags[row.commentId] || [],
        }));
        return acc;
    }, {});
};
