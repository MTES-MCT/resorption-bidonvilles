const sequelize = require('#db/sequelize');
const { fromGeoLevelToTableName } = require('#server/utils/geo');
const { formatName } = require('#server/models/userModel');
const { getUsenameOf, serializeComment } = require('#server/models/shantytownModel');
const { restrict } = require('#server/utils/permission');
const shantytownCommentTagModel = require('#server/models/shantytownCommentTagModel/index');
const getAddressSimpleOf = require('../shantytownModel/_common/getAddressSimpleOf');


module.exports = async (user, location, numberOfActivities, lastDate, maxDate, onlyCovid = false) => {
    // apply geographic level restrictions
    const where = [];
    const replacements = {
        maxDate,
    };
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';

    const restrictedLocations = {
        public: restrict(location).for(user).askingTo('list', 'shantytown_comment'),
        private: restrict(location).for(user).askingTo('listPrivate', 'shantytown_comment'),
    };
    if (restrictedLocations.public === null && restrictedLocations.private === null) {
        return [];
    }

    const permissionWhere = {
        // ces tableaux listent des conditions cumulatives (AND)
        publicComments: [
            'uca.user_target_id IS NULL',
            'oca.organization_target_id IS NULL',
        ],
        privateComments: [
            '(uca.user_target_id IS NOT NULL OR oca.organization_target_id IS NOT NULL)',
        ],
    };

    // public comments
    if (restrictedLocations.public === null) {
        permissionWhere.publicComments.push('false');
    } else if (restrictedLocations.public.type !== 'nation') {
        // geo permission
        const geo = [`${fromGeoLevelToTableName(restrictedLocations.public.type)}.code = :shantytownCommentLocationCode`];
        if (restrictedLocations.public.type === 'city') {
            geo.push(`${fromGeoLevelToTableName(restrictedLocations.public.type)}.fk_main = :shantytownCommentLocationCode`);
        }

        permissionWhere.publicComments.push(`(${geo.join(' OR ')})`);
        replacements.shantytownCommentLocationCode = restrictedLocations.public[restrictedLocations.public.type].code;
    }

    // private comments
    const geo = [];
    if (restrictedLocations.private !== null) {
        if (restrictedLocations.private.type !== 'nation') {
            geo.push(`${fromGeoLevelToTableName(restrictedLocations.private.type)}.code = :privateShantytownCommentLocationCode`);
            if (restrictedLocations.public.type === 'city') {
                geo.push(`${fromGeoLevelToTableName(restrictedLocations.private.type)}.fk_main = :privateShantytownCommentLocationCode`);
            }

            replacements.privateShantytownCommentLocationCode = restrictedLocations.private[restrictedLocations.private.type].code;
        } else {
            geo.push('true');
        }
    }

    // access permission
    // soit l'utilisateur est un auteur/destinataire du message
    // soit il a accès aux commentaires privés sur le territoire considéré (geo.length > 0)
    permissionWhere.privateComments.push(
        `(
                :userId = ANY(uca.user_target_id)
            OR :organizationId = ANY(oca.organization_target_id)
            OR :userId = comments.created_by
            ${geo.length > 0 ? `OR (${geo.join(' OR ')})` : ''}
        )`,
    );
    replacements.userId = user.id;
    replacements.organizationId = user.organization.id;

    where.push(
        `(
            (${permissionWhere.publicComments.join(' AND ')})
            OR
            (${permissionWhere.privateComments.join(' AND ')})
        )`,
    );

    // additional filters
    where.push(`comments.created_at < '${lastDate}'`);
    if (maxDate) {
        where.push('comments.created_at >= :maxDate');
    }
    if (onlyCovid) {
        where.push('covid_comments.shantytown_covid_comment_id IS NOT NULL');
    }

    const activities = await sequelize.query(
        `WITH organization_comment_access AS (
           SELECT 
                scot.fk_comment AS shantytown_comment_id,
                ARRAY_AGG(lo.name) AS organization_target_name,
                ARRAY_AGG(lo.organization_id) AS organization_target_id
            FROM shantytown_comment_organization_targets scot 
            LEFT JOIN localized_organizations lo ON lo.organization_id = scot.fk_organization
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
        )
            SELECT
                comments.shantytown_comment_id AS "commentId",
                comments.description AS "commentDescription",
                comments.created_at AS "commentCreatedAt",
                comments.created_by AS "commentCreatedBy",
                oca.organization_target_name,
                uca.user_target_name,
                author.first_name AS "userFirstName",
                author.last_name AS "userLastName",
                author.position AS "userPosition",
                organizations.abbreviation AS "organizationAbbreviation",
                organizations.name AS "organizationName",
                organizations.organization_id AS "organizationId",
                shantytowns.shantytown_id AS "shantytownId",
                shantytowns.name AS "shantytownName",
                shantytowns.address,
                covid_comments.date AS "covidCommentDate",
                covid_comments.equipe_maraude AS "covidEquipeMaraude",
                covid_comments.equipe_sanitaire AS "covidEquipeSanitaire",
                covid_comments.equipe_accompagnement AS "covidEquipeAccompagnement",
                covid_comments.distribution_alimentaire AS "covidDistributionAlimentaire",
                covid_comments.action_mediation_sante AS "covidActionMediationSante",
                covid_comments.sensibilisation_vaccination AS "covidSensibilisationVaccination",
                covid_comments.equipe_mobile_depistage AS "covidEquipeMobileDepistage",
                covid_comments.equipe_mobile_vaccination AS "covidEquipeMobileVaccination",
                covid_comments.personnes_orientees AS "covidPersonnesOrientees",
                covid_comments.personnes_avec_symptomes AS "covidPersonnesAvecSymptomes",
                covid_comments.besoin_action AS "covidBesoinAction",
                cities.code AS "cityCode",
                cities.name AS "cityName",
                epci.code AS "epciCode",
                epci.name AS "epciName",
                departements.code AS "departementCode",
                departements.name AS "departementName",
                regions.code AS "regionCode",
                regions.name AS "regionName"
            FROM shantytown_comments comments
            LEFT JOIN organization_comment_access oca ON comments.shantytown_comment_id = oca.shantytown_comment_id
            LEFT JOIN user_comment_access uca ON comments.shantytown_comment_id = uca.shantytown_comment_id
            LEFT JOIN shantytowns ON comments.fk_shantytown = shantytowns.shantytown_id
            LEFT JOIN shantytown_covid_comments covid_comments ON covid_comments.fk_comment = comments.shantytown_comment_id
            LEFT JOIN users author ON comments.created_by = author.user_id
            LEFT JOIN organizations ON author.fk_organization = organizations.organization_id
            LEFT JOIN cities ON shantytowns.fk_city = cities.code
            LEFT JOIN epci ON cities.fk_epci = epci.code
            LEFT JOIN departements ON cities.fk_departement = departements.code
            LEFT JOIN regions ON departements.fk_region = regions.code
            ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
            ORDER BY comments.created_at DESC
            ${limit}
            `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    let commentTags = [];
    if (activities.length > 0) {
        commentTags = await shantytownCommentTagModel.getTagsForComments(
            activities.map(({ commentId }) => commentId),
        );
    }

    return activities
        .map(activity => ({
            entity: 'comment',
            action: 'creation',
            date: activity.commentCreatedAt.getTime() / 1000,
            author: {
                name: formatName({
                    first_name: activity.userFirstName,
                    last_name: activity.userLastName,
                }),
                organization: activity.organizationId,
            },

            shantytown: {
                id: activity.shantytownId,
                usename: getUsenameOf({
                    addressSimple: getAddressSimpleOf(activity.address),
                    name: activity.shantytownName,
                }),
                city: {
                    code: activity.cityCode,
                    name: activity.cityName,
                },
                epci: {
                    code: activity.epciCode,
                    name: activity.epciName,
                },
                departement: {
                    code: activity.departementCode,
                    name: activity.departementName,
                },
                region: {
                    code: activity.regionCode,
                    name: activity.regionName,
                },
            },

            comment: serializeComment({
                ...activity,
                tags: commentTags[activity.commentId],
            }),
        }));
};
