import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Permission } from '#server/models/permissionModel/types/Permission.d';
import config from '#server/config';
import { isConstructorDeclaration } from 'typescript';

type UserListExportRow = {
    Courriel: string;
    Prénom: string;
    "Nom de famille": string;
    "Fonction de l'utilisateur": string;
    Téléphone: string;
    "Date de la demande d'accès": string;
    "Date d'envoi du lien d'activation'": string;
    "Date de péremption du lien d'activation'": string;
    "Date d'activation du compte": string;
    "Date d'envoi de l'alerte de désactivation": string
    "Date de dernière connexion": string;
    "Statut calculé": string;
    Organisation: string;
    "Organisation abbr": string;
    "Rôle administrateur de l'acteur": string;
    "Rôle de l'acteur": string;
    "Régions d'intervention": string[];
    "Départements d'intervention": string[];
};

export default async (permission?: Permission): Promise<UserListExportRow[]> => {

    try {
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
                    acc.push(`v_user_areas.${column}::text[] && ARRAY[:${column}]`);
                    return acc;
                }, [] as string[]);
    
                if (clauses.length === 0) {
                    return [];
                }
    
                where = `(${clauses.join(') OR (')})`;
            }
        }
    
        const { inactivityAlert: { delayBeforeDeactivation } } = config;
        const suspendedAccountWhen = delayBeforeDeactivation ? `WHEN fk_status = 'inactive' AND inactivity_alert_sent_at IS NOT NULL 
            AND inactivity_alert_sent_at + INTERVAL '${delayBeforeDeactivation}' < NOW() THEN 'Compte suspendu'` : "";
   
        return sequelize.query(
            `
            SELECT
                email AS "Courriel",
                INITCAP(first_name) AS "Prénom",
                UPPER(last_name) AS "Nom de famille",
                u.position AS "Fonction de l'utilisateur",
                u.phone as "Téléphone",
                TO_CHAR(u.created_at :: DATE, 'dd/mm/yyyy') AS "Date de la demande d'accès",
                TO_CHAR(lua.created_at :: DATE, 'dd/mm/yyyy') AS "Date d'envoi du lien d'activation",
                    TO_CHAR(lua.expires_at :: DATE, 'dd/mm/yyyy') AS "Date de péremption du lien d'activation",
                    CASE
                    WHEN lua.used_at IS NULL THEN 'N/A'
                    ELSE TO_CHAR(lua.used_at :: DATE, 'dd/mm/yyyy')
                END AS "Date d'activation du compte",		
                TO_CHAR(u.inactivity_alert_sent_at :: DATE, 'dd/mm/yyyy') AS "Date d'envoi de l'alerte de désactivation",
                TO_CHAR(u.last_access :: DATE, 'dd/mm/yyyy') AS "Date de dernière connexion",
                CASE
                    WHEN fk_status = 'active' THEN 'Compte actif'
                    WHEN fk_status = 'new' AND lua.created_at IS NULL
                        THEN 'En attente du lien d''activation'
                    WHEN fk_status = 'new' AND lua.created_at IS NOT NULL AND lua.used_at IS NULL AND lua.expires_at IS NOT NULL AND lua.expires_at >= NOW()
                        THEN 'En attente de l''activation par l''utilisateur'
                    WHEN fk_status = 'new' AND lua.created_at IS NOT NULL AND lua.used_at IS NULL AND lua.expires_at IS NOT NULL AND lua.expires_at < NOW()
                        THEN 'Lien d''activation expiré'
                    WHEN fk_status = 'inactive' AND u.inactivity_alert_sent_at IS NULL
                        THEN 'Compte désactivé'
                    ${suspendedAccountWhen}
                    ELSE 'Anomalie sur le calcul du statut du compte'
                END AS "Statut calculé",
                o.name AS "Organisation",
                o.abbreviation AS "Organisation abbr",
                    u.fk_role AS "Rôle administrateur de l'acteur",
                    rr.name AS "Rôle de l'acteur",
                v_user_areas.regions AS "Régions d'intervention",
                v_user_areas.departements AS "Départements d'intervention"
            FROM users u
            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
            LEFT JOIN last_user_accesses lua ON lua.fk_user = u.user_id
            LEFT JOIN v_user_areas ON v_user_areas.user_id = u.user_id AND v_user_areas.is_main_area IS TRUE
            LEFT JOIN roles_regular rr ON rr.role_id = u.fk_role_regular
            ${where !== null ? `WHERE (${where})` : ''}
            ORDER BY
                "Statut calculé",
                used_at ASC,
                expires_at DESC;`,
            {
                type: QueryTypes.SELECT,
                replacements,
            },
        );
    } catch (error) {
        console.error(error);
        return [];
    }   
};
