import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Permission } from '#server/models/permissionModel/types/Permission.d';

type UserListExportRow = {
    "Date de la demande d'accès": string;
    Courriel: string;
    Prénom: string;
    'Nom de famille': string;
    "Fonction de l'utilisateur": string;
    Téléphone: string;
    Statut: string;
    "Date d'activation du compte": string;
    "Rôle administrateur de l'acteur": string;
    'Date de dernière connexion': string;
    Organisation: string;
    'Organisation abbr': string;
    "Rôle de l'acteur": string;
    "Régions d'intervention": string[];
    "Départements d'intervention": string[];
};

export default async (permission?: Permission): Promise<UserListExportRow[]> => {
    const replacements = {};

    let where: string = null;
    if (permission !== undefined) {
        if (permission === null) {
            return [];
        }

        if (permission.allowed_on_national !== true) {
            const clauses = ['regions', 'departements', 'epci', 'cities'].reduce((acc, column) => {
                if (permission.allowed_on[column]?.length <= 0) {
                    return acc;
                }

                replacements[column] = permission.allowed_on[column].map(l => l[l.type].code);
                acc.push(`user_intervention_areas.${column}::text[] && ARRAY[:${column}]`);
                return acc;
            }, [] as string[]);

            if (clauses.length === 0) {
                return [];
            }

            where = `(${clauses.join(') OR (')})`;
        }
    }

    return sequelize.query(
        `WITH user_intervention_areas AS (
            SELECT
                users.user_id,
                COUNT(CASE WHEN intervention_areas.type = 'nation' THEN 1 ELSE null END) > 0 AS is_national,
                array_remove(array_agg(intervention_areas.fk_region), NULL) AS regions,
                array_remove(array_agg(intervention_areas.fk_departement), NULL) AS departements,
                array_remove(array_agg(intervention_areas.fk_epci), NULL) AS epci,
                array_remove(array_agg(intervention_areas.fk_city), NULL) AS cities
            FROM users
            LEFT JOIN intervention_areas ON (
                users.user_id = intervention_areas.fk_user
                OR (users.use_custom_intervention_area IS FALSE AND users.fk_organization = intervention_areas.fk_organization)
            )
            WHERE intervention_areas.is_main_area IS TRUE
            GROUP BY users.user_id
        )

        SELECT
            TO_CHAR(u.created_at :: DATE, 'dd/mm/yyyy') AS "Date de la demande d'accès",
            email AS "Courriel",
            INITCAP(first_name) AS "Prénom",
            UPPER(last_name) AS "Nom de famille",
            u.position AS "Fonction de l'utilisateur",
            u.phone as "Téléphone",
            CASE
                WHEN fk_status = 'active' THEN 'Compte activé'
                WHEN fk_status = 'new' THEN 'Compte en attente d''un lien d''activation'
                WHEN lua.expires_at < NOW() THEN 'Lien d''activation expiré'
                ELSE 'Lien d''activation toujours valide'
            END AS "Statut",
            CASE
                WHEN lua.used_at IS NULL THEN 'N/A'
                ELSE TO_CHAR(lua.used_at :: DATE, 'dd/mm/yyyy')
            END AS "Date d'activation du compte",
            u.fk_role AS "Rôle administrateur de l'acteur",
            TO_CHAR(u.last_access :: DATE, 'dd/mm/yyyy') AS "Date de dernière connexion",
            o.name AS "Organisation",
            o.abbreviation AS "Organisation abbr",
            rr.name AS "Rôle de l'acteur",
            user_intervention_areas.regions AS "Régions d'intervention",
            user_intervention_areas.departements AS "Départements d'intervention"
        FROM users u
        LEFT JOIN organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN last_user_accesses lua ON lua.fk_user = u.user_id
        LEFT JOIN user_intervention_areas ON user_intervention_areas.user_id = u.user_id
        LEFT JOIN roles_regular rr ON rr.role_id = u.fk_role_regular
        WHERE
            u.fk_status <> 'inactive'
            ${where !== null ? `AND (${where})` : ''}
        ORDER BY
            used_at ASC,
            expires_at DESC;`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
