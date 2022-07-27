module.exports = comment => Object.assign(
    {
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
    },
    comment.covidCommentDate
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
        : {},
);
