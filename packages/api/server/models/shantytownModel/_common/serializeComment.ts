import ShantytownComment from '#server/models/shantytownCommentModel/ShantytownComment.d';
import { CommentTag } from '#server/models/shantytownCommentTagModel/serializeCommentTag';
import attachmentModel from '#server/models/attachmentModel';
import { ShantytownCommentRow } from '../../shantytownCommentModel/ShantytownCommentRow.d';

type shantytownCommentRowWithTags = ShantytownCommentRow & {
    tags: CommentTag[]
};


export default async (comment: shantytownCommentRowWithTags): Promise<ShantytownComment> => {
    const attachments = await Promise.all(
        comment.attachments?.length
            ? comment.attachments.map(attachmentModel.serializeAttachment)
            : [],
    );

    return {
        id: comment.commentId,
        description: comment.commentDescription,
        createdAt: comment.commentCreatedAt !== null ? (comment.commentCreatedAt.getTime() / 1000) : null,
        organization_target_name: comment.organization_target_name || [],
        user_target_name: comment.user_target_name || [],
        createdBy: {
            id: comment.commentCreatedBy,
            first_name: comment.userFirstName,
            last_name: comment.userLastName,
            position: comment.userPosition,
            organization: comment.organizationAbbreviation || comment.organizationName,
            organization_id: comment.organizationId,
        },
        shantytown: comment.shantytownId,
        tags: comment.tags,
        ...(comment.covidCommentDate
            ? {
                covid: {
                    date: comment.covidCommentDate.getTime() / 1000,
                    equipe_maraude: comment.covidEquipeMaraude,
                    equipe_sanitaire: comment.covidEquipeSanitaire,
                    equipe_accompagnement: comment.covidEquipeAccompagnement,
                    distribution_alimentaire: comment.covidDistributionAlimentaire,
                    action_mediation_sante: comment.covidActionMediationSante,
                    sensibilisation_vaccination: comment.covidSensibilisationVaccination,
                    equipe_mobile_depistage: comment.covidEquipeMobileDepistage,
                    equipe_mobile_vaccination: comment.covidEquipeMobileVaccination,
                    personnes_orientees: comment.covidPersonnesOrientees,
                    personnes_avec_symptomes: comment.covidPersonnesAvecSymptomes,
                    besoin_action: comment.covidBesoinAction,
                },
            }
            : {}),
        attachments,
    };
};
