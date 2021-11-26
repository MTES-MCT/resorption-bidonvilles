const { sequelize } = require('#db/models');

module.exports = async () => sequelize.query(
    `SELECT
        TO_CHAR(u.created_at :: DATE, 'dd/mm/yyyy') AS "Date de la demande d'accès",
        email AS "Courriel",
        INITCAP(first_name) AS "Prénom",
        UPPER(last_name) AS "Nom de famille",
        u.position AS "Fonction de l'utilisateur",
        u.phone as "Téléphone",
        CASE
            WHEN fk_status = 'active' THEN 'Compte activé'
            WHEN lua.expires_at < NOW() THEN 'Lien d''activation expiré'
            ELSE 'Lien d''activation toujours valide'
        END AS "Statut",
        TO_CHAR(lua.used_at :: DATE, 'dd/mm/yyyy') AS "Date d'activation du compte",
        u.fk_role AS "Rôle administrateur de l'acteur",
        TO_CHAR(u.last_access :: DATE, 'dd/mm/yyyy') AS "Date de dernière connexion",    
        o.name AS "Organisation",
        o.abbreviation AS "Organisation abbr",
        rr.name AS "Rôle de l'acteur",
        o.region_code AS "Code région",
        o.region_name AS "Région",
        o.departement_code AS "Code département",
        o.departement_name AS "Département"
    FROM
        users u
    LEFT JOIN
        last_user_accesses lua ON lua.fk_user = u.user_id
    LEFT JOIN
        localized_organizations o ON o.organization_id = u.fk_organization
    LEFT JOIN
       roles_regular rr ON rr.role_id = u.fk_role_regular
    WHERE
        lua.user_access_id IS NOT NULL 
    AND
       u.fk_status <> 'inactive'
    ORDER BY
        "Code région",
        "Code département",
        used_at ASC,
        expires_at DESC;`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
