import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import serializeComment from './serializeComment';

export default async (user, shantytownIds, covid = false) => {
    const comments = shantytownIds.reduce((acc, id) => Object.assign({}, acc, {
        [id]: [],
    }), {});

    if (covid === false && !user.isAllowedTo('list', 'shantytown_comment')) {
        return comments;
    }

    const filterPrivateComments = !user.isAllowedTo('listPrivate', 'shantytown_comment');

    const rows = await sequelize.query(
        `SELECT
            shantytown_comments.shantytown_comment_id AS "commentId",
            shantytown_comments.fk_shantytown AS "shantytownId",
            shantytown_comments.description AS "commentDescription",
            shantytown_comments.created_at AS "commentCreatedAt",
            shantytown_comments.created_by AS "commentCreatedBy",
            shantytown_comments.private AS "commentPrivate",
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
            shantytown_covid_comments.besoin_action AS "covidBesoinAction",
            users.first_name AS "userFirstName",
            users.last_name AS "userLastName",
            users.position AS "userPosition",
            organizations.organization_id AS "organizationId",
            organizations.name AS "organizationName",
            organizations.abbreviation AS "organizationAbbreviation"
        FROM shantytown_comments
        LEFT JOIN users ON shantytown_comments.created_by = users.user_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN shantytown_covid_comments ON shantytown_covid_comments.fk_comment = shantytown_comments.shantytown_comment_id
        WHERE
            shantytown_comments.fk_shantytown IN (:ids) 
            AND shantytown_covid_comment_id IS ${covid === true ? 'NOT ' : ''}NULL
            ${filterPrivateComments === true ? 'AND private IS FALSE ' : ''}
        ORDER BY shantytown_comments.created_at DESC`,
        {
            type: QueryTypes.SELECT,
            replacements: { ids: shantytownIds },
        },
    );

    rows.forEach((comment) => {
        comments[comment.shantytownId].push(
            serializeComment(comment),
        );
    }, {});

    return comments;
};
