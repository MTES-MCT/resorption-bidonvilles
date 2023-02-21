import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';

export default (clauseGroup?: WhereClauseGroup) => {
    const replacements = {};

    let where: string = null;
    if (clauseGroup && Object.keys(clauseGroup).length > 0) {
        where = Object.keys(clauseGroup).map((column, index) => {
            replacements[`${column}${index}`] = clauseGroup[column].value !== undefined ? clauseGroup[column].value : clauseGroup[column];
            if (clauseGroup[column].anyOperator !== undefined) {
                const clause = `(:${column}${index}) ${clauseGroup[column].anyOperator} ANY(${clauseGroup[column].query || `u.${column}`})`;
                if (clauseGroup[column].not === true) {
                    return `NOT(${clause})`;
                }

                return clause;
            }

            if (replacements[`${column}${index}`] === null) {
                return `${clauseGroup[column].query || `u.${column}`} IS ${clauseGroup[column].not === true ? 'NOT ' : ''}NULL`;
            }

            return `${clauseGroup[column].query || `u.${column}`} ${clauseGroup[column].not === true ? 'NOT ' : ''}${clauseGroup[column].operator || 'IN'} (:${column}${index})`;
        }).join(' OR ');
    }

    return sequelize.query(
        `SELECT
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
        LEFT JOIN cities ON o.city_code = cities.code
        LEFT JOIN departements ON o.departement_code = departements.code
        LEFT JOIN epci ON o.epci_code = epci.code
        LEFT JOIN regions ON o.region_code = regions.code
        LEFT JOIN
        roles_regular rr ON rr.role_id = u.fk_role_regular
        WHERE
            u.fk_status <> 'inactive'
            ${where !== null ? `AND (${where})` : ''}
        ORDER BY
            "Code région",
            "Code département",
            used_at ASC,
            expires_at DESC;`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
