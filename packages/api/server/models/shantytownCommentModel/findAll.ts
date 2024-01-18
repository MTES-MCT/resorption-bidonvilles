import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Location } from '#server/models/geoModel/Location.d';
import geoUtils from '#server/utils/geo';
import { buildWhere, type WhereObjClause } from '#server/utils/sql';
import { User } from '#root/types/resources/User.d';

const { fromGeoLevelToTableName } = geoUtils;

type ShantytownCommentRow = {
    commentId: number,
    commentDescription: string,
    shantytownId: number,
    commentCreatedAt: Date,
    commentCreatedBy: number,
    userId: number,
    userFirstName: string,
    userLastName: string,
    userPosition: string,
    userRole: string,
    organizationAbbreviation: string,
    organizationName: string,
    organizationId: number,
    departementName: string,
    shantytownResorptionTarget: number,
    commentPrivate: boolean,
    organization_target_names: string[],
    user_target_names: string[],
    tags: string[],
};

export default (user: User, geoFilter: Location[] = null, privateFilter: Location[] = null): Promise<ShantytownCommentRow[]> => {
    // si la liste des territoires autorisés est spécifiée mais qu'elle est vide
    // autant s'arrêter là et ne pas faire de requête
    if (geoFilter?.length === 0) {
        return Promise.resolve([]);
    }

    // on va construire une clause where dont la logique finale désirée est la suivante :
    // insideGeoFilter ET (isPublic OU insidePrivateFilter OU isTarget OU isAuthor)
    const clauses = {
        insideGeoFilter: null,
        insidePrivateFilter: null,
        isPublic: 'uca.user_target_ids IS NULL AND oca.organization_target_ids IS NULL',
        isTarget: ':organizationId = ANY(oca.organization_target_ids) OR :userId = ANY(uca.user_target_ids)',
        isAuthor: 'sc.created_by = :userId',
    };
    const replacements: any = {
        userId: user.id,
        organizationId: user.organization.id,
    };

    // on construit insideGeoFilter
    if (geoFilter !== null && !geoFilter.some(l => l.type === 'nation')) {
        clauses.insideGeoFilter = geoFilter.map((l, index) => {
            replacements[`publicLocationCode${index}`] = l[l.type].code;

            const isInLocation = [`${fromGeoLevelToTableName(l.type)}.code = :publicLocationCode${index}`];
            if (l.type === 'city') {
                isInLocation.push(`${fromGeoLevelToTableName(l.type)}.fk_main = :publicLocationCode${index}`);
            }

            return isInLocation.join(' OR ');
        }).join(' OR ');
    }

    // on construit insidePrivateFilter
    if (privateFilter !== null && !geoFilter.some(l => l.type === 'nation')) {
        if (privateFilter.length > 0) {
            clauses.insidePrivateFilter = privateFilter.map((l, index) => {
                replacements[`privateLocationCode${index}`] = l[l.type].code;

                const isInLocation = [`${fromGeoLevelToTableName(l.type)}.code = :privateLocationCode${index}`];
                if (l.type === 'city') {
                    isInLocation.push(`${fromGeoLevelToTableName(l.type)}.fk_main = :privateLocationCode${index}`);
                }

                return isInLocation.join(' OR ');
            }).join(' OR ');
        }
    } else {
        // si pas de filtre privé ou accès national, on inclue toujours les commentaires privés
        clauses.insidePrivateFilter = 'TRUE';
    }

    // on construit enfin la clause where finale
    const w: WhereObjClause = {
        and: [
            ...(clauses.insideGeoFilter ? [clauses.insideGeoFilter] : []),
            {
                or: [
                    clauses.isPublic,
                    ...(clauses.insidePrivateFilter ? [clauses.insidePrivateFilter] : []),
                    clauses.isTarget,
                    clauses.isAuthor,
                ],
            },
        ],
    };

    return sequelize.query(
        `WITH organization_comment_access AS (
            SELECT 
                scot.fk_comment AS shantytown_comment_id,
                ARRAY_AGG(o.name) AS organization_target_names,
                ARRAY_AGG(o.organization_id) AS organization_target_ids
            FROM shantytown_comment_organization_targets scot 
            LEFT JOIN organizations o ON o.organization_id = scot.fk_organization
            GROUP BY scot.fk_comment
        ),
        user_comment_access AS (
            SELECT 
                scut.fk_comment AS shantytown_comment_id,
                ARRAY_AGG(CONCAT(users.first_name, ' ', users.last_name)) AS user_target_names,
                ARRAY_AGG(users.user_id) AS user_target_ids
            FROM shantytown_comment_user_targets scut 
            LEFT JOIN users ON users.user_id = scut.fk_user
            GROUP BY scut.fk_comment
        ),
        tags AS (
            SELECT
                sct.fk_shantytown_comment,
                array_agg(ct.tag) AS tags
            FROM shantytown_comment_tags sct
            LEFT JOIN comment_tags ct ON sct.fk_comment_tag = ct.uid
            GROUP BY sct.fk_shantytown_comment
        )

        SELECT
            sc.shantytown_comment_id AS "commentId",
            sc.description AS "commentDescription",
            sc.fk_shantytown AS "shantytownId",
            sc.created_at AS "commentCreatedAt",
            sc.created_by "commentCreatedBy",
            u.user_id AS "userId",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            rr.name AS "userRole",
            o.abbreviation AS "organizationAbbreviation",
            o.name AS "organizationName",
            o.organization_id AS "organizationId",
            departements.name AS "departementName",
            s.resorption_target AS "shantytownResorptionTarget",
            COALESCE(oca.organization_target_names, uca.user_target_names) IS NOT NULL AS "commentPrivate",
            oca.organization_target_names,
            uca.user_target_names,
            tags.tags AS "tags"
        FROM shantytown_comments sc
        LEFT JOIN users u ON sc.created_by = u.user_id
        LEFT JOIN roles_regular rr ON u.fk_role_regular = rr.role_id
        LEFT JOIN organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN shantytowns s ON sc.fk_shantytown = s.shantytown_id
        LEFT JOIN cities c ON s.fk_city = cities.code
        LEFT JOIN epci ON cities.fk_epci = epci.code
        LEFT JOIN departements ON cities.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        LEFT JOIN organization_comment_access oca ON sc.shantytown_comment_id = oca.shantytown_comment_id
        LEFT JOIN user_comment_access uca ON sc.shantytown_comment_id = uca.shantytown_comment_id
        LEFT JOIN tags ON tags.fk_shantytown_comment = sc.shantytown_comment_id
        WHERE ${buildWhere(w)}
        ORDER BY sc.created_at DESC`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
