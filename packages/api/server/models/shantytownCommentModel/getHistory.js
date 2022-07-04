const sequelize = require('#db/sequelize');
const { fromGeoLevelToTableName } = require('#server/utils/geo');
const { formatName } = require('#server/models/userModel');
const { getUsenameOf, serializeComment } = require('#server/models/shantytownModel');
const { restrict } = require('#server/utils/permission');

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

    // public comments
    if (restrictedLocations.public === null) {
        where.push('(uca.user_target_id IS NULL AND oca.organization_target_id IS NULL) AND false');
    } else if (restrictedLocations.public.type !== 'nation') {
        where.push(`(uca.user_target_id IS NULL AND oca.organization_target_id IS NULL) AND ${fromGeoLevelToTableName(restrictedLocations.public.type)}.code = :shantytownCommentLocationCode`);
        if (restrictedLocations.public.type === 'city') {
            where.push(`(uca.user_target_id IS NULL AND oca.organization_target_id IS NULL) AND ${fromGeoLevelToTableName(restrictedLocations.public.type)}.fk_main = :shantytownCommentLocationCode`);
        }
        replacements.shantytownCommentLocationCode = restrictedLocations.public[restrictedLocations.public.type].code;
    } else {
        where.push('(uca.user_target_id IS NULL AND oca.organization_target_id IS NULL)');
    }

    // private comments for user with listPrivate.shantytown_comment permission
    if (restrictedLocations.private === null) {
        where.push('false');
    } else if (restrictedLocations.private.type !== 'nation') {
        where.push(`${fromGeoLevelToTableName(restrictedLocations.private.type)}.code = :privateShantytownCommentLocationCode`);
        if (restrictedLocations.public.type === 'city') {
            where.push(`${fromGeoLevelToTableName(restrictedLocations.private.type)}.fk_main = :privateShantytownCommentLocationCode`);
        }
        replacements.privateShantytownCommentLocationCode = restrictedLocations.private[restrictedLocations.private.type].code;
    } else {
        where.push('true');
    }

    // private comments for targeted users
    where.push(`(${user.id} =  ANY(uca.user_target_id) OR ${user.organization.id} = ANY(oca.organization_target_id))`);
    where.push(`${user.id} = comments.created_by`);

    const whereLastDate = `${where.length > 0 ? 'AND' : 'WHERE'} comments.created_at < '${lastDate}'`;
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
                (SELECT regexp_matches(shantytowns.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] AS "shantytownAddressSimple",
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
            ${where.length > 0 ? `WHERE ((${where.join(') OR (')}))` : ''}
            ${whereLastDate}
            ${maxDate ? ' AND comments.created_at >= :maxDate' : ''}
            ${onlyCovid ? 'AND covid_comments.shantytown_covid_comment_id IS NOT NULL' : ''}
            ORDER BY comments.created_at DESC
            ${limit}
            `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

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
                    addressSimple: activity.shantytownAddressSimple,
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

            comment: serializeComment(activity),
        }));
};
