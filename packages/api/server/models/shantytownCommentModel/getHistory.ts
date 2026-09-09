import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import geoUtils from '#server/utils/geo';
import userModel from '#server/models/userModel';
import permissionUtils from '#server/utils/permission';
import shantytownCommentTagModel from '#server/models/shantytownCommentTagModel/index';
import { CommentTagObject } from '#server/models/shantytownCommentTagModel/getTagsForComments';
import getAddressSimpleOf from '#server/models/shantytownModel/_common/getAddressSimpleOf';
import getUsenameOf from '#server/models/shantytownModel/_common/getUsenameOf';
import outremer from '#server/utils/permission/outremer';
import { Location } from '#server/models/geoModel/Location.d';
import serializeComment from '#server/models/shantytownCommentModel/serializeComment';
import { ShantytownCommentRow } from '#server/models/shantytownCommentModel/ShantytownCommentRow.d';
import { ShantytownCommentActivity } from '#root/types/resources/Activity.d';
import { User } from '#root/types/resources/User.d';

const { fromGeoLevelToTableName } = geoUtils;
const { formatName } = userModel;
const { restrict } = permissionUtils;


export type ShantytownCommentHistoryRow = ShantytownCommentRow & {
    shantytownId: number,
    shantytownName: string,
    address: string,
    cityCode: string,
    cityName: string,
    epciCode: string,
    epciName: string,
    departementCode: string,
    departementName: string,
    regionCode: string,
    regionName: string
};
const RESTRICTED_LOCATION_TYPES = new Set(['metropole', 'outremer']);

function buildLocationClauseFragments(locations: Location[], replacementPrefix: string): { clauses: string[], replacements: Record<string, unknown> } {
    const extraReplacements: Record<string, unknown> = {};

    const clauses = locations.flatMap((l, index) => {
        // On fait l'exclusion ou inclusion si c'est metropole ou outremer
        if (RESTRICTED_LOCATION_TYPES.has(l.type)) {
            extraReplacements.outreMerDepts = outremer.departements;
            return l.type === 'metropole'
                ? 'departements.code NOT IN (:outreMerDepts)'
                : 'departements.code IN (:outreMerDepts)';
        }

        const key = `${replacementPrefix}${index}`;
        const arr = [`${fromGeoLevelToTableName(l.type)}.code = :${key}`];
        if (l.type === 'city') {
            arr.push(`${fromGeoLevelToTableName(l.type)}.fk_main = :${key}`);
        }
        extraReplacements[key] = (l as any)[l.type].code;

        return arr;
    });

    return { clauses, replacements: extraReplacements };
}

function buildPublicCommentsClause(publicLocations: Location[]): { clause: string | null, replacements: Record<string, unknown> } {
    if (publicLocations.length === 0) {
        return { clause: 'false', replacements: {} };
    }
    if (publicLocations.some(l => l.type === 'nation')) {
        return { clause: null, replacements: {} };
    }

    const { clauses, replacements } = buildLocationClauseFragments(publicLocations, 'shantytownCommentLocationCode');
    return { clause: `(${clauses.join(' OR ')})`, replacements };
}

function buildPrivateCommentsLocationClause(privateLocations: Location[]): { clauses: string[], replacements: Record<string, unknown> } {
    if (privateLocations.length === 0) {
        return { clauses: [], replacements: {} };
    }
    if (privateLocations.some(l => l.type === 'nation')) {
        return { clauses: ['true'], replacements: {} };
    }

    return buildLocationClauseFragments(privateLocations, 'privateShantytownCommentLocationCode');
}

export default async function getHistory(
    user: User,
    location: Location,
    numberOfActivities: number,
    lastDate: Date | string,
    maxDate: Date | string | null,
): Promise<ShantytownCommentActivity[]> {
    // apply geographic level restrictions
    const where: string[] = [];
    const replacements: any = {
        maxDate,
    };
    const limit = numberOfActivities !== -1 ? 'LIMIT :numberOfActivities' : '';
    if (numberOfActivities !== -1) {
        replacements.numberOfActivities = numberOfActivities;
    }
    const restrictedLocations = {
        public: restrict(location).for(user).askingTo('list', 'shantytown_comment'),
        private: restrict(location).for(user).askingTo('listPrivate', 'shantytown_comment'),
    };
    if (restrictedLocations.public.length === 0 && restrictedLocations.private.length === 0) {
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
    const publicCommentsResult = buildPublicCommentsClause(restrictedLocations.public);
    Object.assign(replacements, publicCommentsResult.replacements);
    if (publicCommentsResult.clause !== null) {
        permissionWhere.publicComments.push(publicCommentsResult.clause);
    }

    // private comments
    const privateCommentsLocationResult = buildPrivateCommentsLocationClause(restrictedLocations.private);
    Object.assign(replacements, privateCommentsLocationResult.replacements);
    const privateCommentLocationClause = privateCommentsLocationResult.clauses;

    // access permission
    // soit l'utilisateur est un auteur/destinataire du message
    // soit il a accès aux commentaires privés sur le territoire considéré (geo.length > 0)
    permissionWhere.privateComments.push(
        `(
                :userId = ANY(uca.user_target_id)
            OR :organizationId = ANY(oca.organization_target_id)
            OR :userId = comments.created_by
            ${privateCommentLocationClause.length > 0 ? `OR (${privateCommentLocationClause.join(' OR ')})` : ''}
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

    // on vérifie que le commentaire est bien sur le territoire de la recherche
    let searchLocationClause: string[] = [];
    if (location.type !== 'nation') {
        const { clauses, replacements: searchLocationReplacements } = buildLocationClauseFragments([location], 'shantytownCommentSearchLocationCode');
        Object.assign(replacements, searchLocationReplacements);
        searchLocationClause = clauses;
    } else {
        searchLocationClause.push('true');
    }

    where.push(`(${searchLocationClause.join(' OR ')})`);

    // additional filters
    replacements.lastDate = lastDate;
    where.push('comments.created_at < :lastDate');
    if (maxDate) {
        where.push('comments.created_at >= :maxDate');
    }

    const activities = await sequelize.query(
        `WITH organization_comment_access AS (
           SELECT
                scot.fk_comment AS shantytown_comment_id,
                ARRAY_AGG(organizations.name) AS organization_target_name,
                ARRAY_AGG(organizations.organization_id) AS organization_target_id
            FROM shantytown_comment_organization_targets scot 
            LEFT JOIN organizations ON organizations.organization_id = scot.fk_organization
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
            type: QueryTypes.SELECT,
            replacements,
        },
    );

    let commentTags: CommentTagObject = {};
    if (activities.length > 0) {
        commentTags = await shantytownCommentTagModel.getTagsForComments(
            activities.map(({ commentId }: any) => commentId),
        );
    }

    return activities
        .map((activity: ShantytownCommentHistoryRow): ShantytownCommentActivity => ({
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
                    address: '',
                    name: activity.shantytownName,
                }),
                city: {
                    code: activity.cityCode,
                    name: activity.cityName,
                    main: null,
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
                tags: commentTags[activity.commentId] || [],
            }),
        }));
}
