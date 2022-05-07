import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import geoUtils from '#server/utils/geo';
import userModelFactory from '#server/models/userModel';
import shantytownModelFactory from '#server/models/shantytownModel';
import permissionUtils from '#server/utils/permission';

const { fromGeoLevelToTableName } = geoUtils;
const { formatName } = userModelFactory();
const { getUsenameOf, serializeComment } = shantytownModelFactory();

const { restrict } = permissionUtils;

type Replacements = {
    [key: string]: any
};

export default async (user, location, numberOfActivities, lastDate, maxDate, onlyCovid = false) => {
    // apply geographic level restrictions
    const where = [];
    const replacements: Replacements = {
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
        where.push('private != false AND false');
    } else if (restrictedLocations.public.type !== 'nation') {
        where.push(`private = false AND ${fromGeoLevelToTableName(restrictedLocations.public.type)}.code = :shantytownCommentLocationCode`);
        replacements.shantytownCommentLocationCode = restrictedLocations.public[restrictedLocations.public.type].code;
    } else {
        where.push('private = false');
    }

    // private comments
    if (restrictedLocations.private === null) {
        where.push('private != true AND false');
    } else if (restrictedLocations.private.type !== 'nation') {
        where.push(`private = true AND ${fromGeoLevelToTableName(restrictedLocations.private.type)}.code = :privateShantytownCommentLocationCode`);
        replacements.privateShantytownCommentLocationCode = restrictedLocations.private[restrictedLocations.private.type].code;
    } else {
        where.push('private = true');
    }

    const whereLastDate = `${where.length > 0 ? 'AND' : 'WHERE'} comments.created_at < '${lastDate}'`;

    const activities = await sequelize.query(
        `
            SELECT
                comments.shantytown_comment_id AS "commentId",
                comments.description AS "commentDescription",
                comments.created_at AS "commentCreatedAt",
                comments.private AS "commentPrivate",
                comments.created_by AS "commentCreatedBy",
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
            type: QueryTypes.SELECT,
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
