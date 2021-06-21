/* eslint-disable no-console */
const { sequelize } = require('../models');

/**
 * @param {String} authorityLevel the local authority level required (region or departement)
 * @returns {String} a query string
 */
function buildQueryString(authorityLevel, upOrDown) {
    let foreign_key;
    let where_clause1;
    let where_clause2;
    if (authorityLevel === 'region' && upOrDown === 'up') {
        foreign_key = 'o.fk_region';
        where_clause1 = 'UPPER(ot.abbreviation) = \'DIRECCTE\'';
        where_clause2 = 'UPPER(ot.abbreviation) = \'DRETS\'';
    }
    if (authorityLevel === 'departement' && upOrDown === 'up') {
        foreign_key = 'o.fk_departement';
        where_clause1 = 'UPPER(ot.abbreviation) = \'DDCS / DDCSPP\'';
        where_clause2 = 'UPPER(ot.abbreviation) = \'DDETS\'';
    }
    if (authorityLevel === 'region' && upOrDown === 'down') {
        foreign_key = 'o.fk_region';
        where_clause1 = 'UPPER(ot.abbreviation) = \'DRETS\'';
        where_clause2 = 'UPPER(ot.abbreviation) = \'DIRECCTE\'';
    }
    if (authorityLevel === 'departement' && upOrDown === 'down') {
        foreign_key = 'o.fk_departement';
        where_clause1 = 'UPPER(ot.abbreviation) = \'DDETS\'';
        where_clause2 = 'UPPER(ot.abbreviation) = \'DDCS / DDCSPP\'';
    }

    return `SELECT
                ORGA_OLD.old_orga_id,
                ORGA_OLD.old_orga_abbreviation,
                ORGA_OLD.old_fk_orga_level,
                ORGA_NEW.new_orga_id,
                ORGA_NEW.new_orga_abbreviation,
                ORGA_NEW.new_fk_orga_level
        FROM
            (
                SELECT
                        o.organization_id AS old_orga_id,
                        UPPER(ot.abbreviation) AS old_orga_abbreviation,
                        ${foreign_key} AS old_fk_orga_level
                FROM
                        organizations o
                LEFT JOIN
                        organization_types ot
                            ON ot.organization_type_id = o.fk_type
                WHERE
                        ${where_clause1}
            ) AS ORGA_OLD
        LEFT JOIN
            (
                SELECT
                        o.organization_id AS new_orga_id,
                        UPPER(ot.abbreviation) AS new_orga_abbreviation,
                        ${foreign_key} AS new_fk_orga_level
                FROM
                        organizations o
                LEFT JOIN
                        organization_types ot
                            ON ot.organization_type_id = o.fk_type
                WHERE
                        ${where_clause2}
            ) AS ORGA_NEW
                ON ORGA_NEW.new_fk_orga_level = ORGA_OLD.old_fk_orga_level
        ORDER BY
            2,3`;
}

/**
 * Returns old ids for departemental (DDCS/DDCSP) and regional (DIRECCTE) organizations
 * and new ids for what they are now: DDETS as departemental and DRETS as regional organizations
 * @param {string} authorityLevel The level of the local authority (region or departement)
 */
function getOrganizationsCorrespondence(queryInterface, authorityLevel, upOrDown) {
    return sequelize.query(buildQueryString(authorityLevel, upOrDown),
        {
            type: queryInterface.sequelize.QueryTypes.SELECT,
        });
}

/**
 *
 * @param {*} record an object containing old and new values to build the queryString
 * @returns sequelize.query result: a result array [and an object containing metadata]
 */
async function updateFkOrganizationInUserTable(record, transaction) {
    return sequelize.query(
        `   UPDATE users
            SET fk_organization = :organization_new_code
            WHERE fk_organization = :organization_old_code`,
        {
            transaction,
            replacements:
                {
                    organization_new_code: record.new_orga_id,
                    organization_old_code: record.old_orga_id,
                },
        },
    );
}

/**
 *
 * @param {*} record an object containing old and new values to build the queryString
 * @returns sequelize.query result: a result array [and an object containing metadata]
 */
async function updateFkOrganizationInStatDirectoryViewsTable(record, transaction) {
    return sequelize.query(
        `   UPDATE stat_directory_views
            SET organization = :organization_new_code
            WHERE organization = :organization_old_code`,
        {
            transaction,
            replacements:
                {
                    organization_new_code: record.new_orga_id,
                    organization_old_code: record.old_orga_id,
                },
        },
    );
}

module.exports = {
    up: queryInterface => Promise.all([
        getOrganizationsCorrespondence(queryInterface, 'region', 'up'),
        getOrganizationsCorrespondence(queryInterface, 'departement', 'up'),
    ])
        .then(data => queryInterface.sequelize.transaction(
            transaction => Promise.all([
                data[0].forEach(async (record) => {
                    // Mise à jour du code organisation des utilisateurs Direccte en DRETS
                    await updateFkOrganizationInUserTable(record, transaction);
                    // Mise à jour du code Direccte en DRETS dans la table stat_directory_views
                    await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
                }),
                data[1].forEach(async (record) => {
                    // Mise à jour du code organisation des utilisateurs DDCS / DDCSPP en DDETS
                    await updateFkOrganizationInUserTable(record, transaction);
                    // Mise à jour du code DDCS / DDCSPP en DDETS dans la table stat_directory_views
                    await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
                }),
            ]),
        )),

    down: queryInterface => Promise.all([
        getOrganizationsCorrespondence(queryInterface, 'region', 'down'),
        getOrganizationsCorrespondence(queryInterface, 'departement', 'down'),
    ])
        .then(data => queryInterface.sequelize.transaction(
            transaction => Promise.all([
                data[0].forEach(async (record) => {
                    // Mise à jour du code organisation des utilisateurs DRETS en Direccte
                    await updateFkOrganizationInUserTable(record, transaction);
                    // Mise à jour du code DRETS en Direccte dans la table stat_directory_views
                    await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
                    // Suppression de l'organisation de type Direccte
                }),
                data[1].forEach(async (record) => {
                    // Mise à jour du code organisation des utilisateurs DDETS en DDCS / DDCSPP
                    await updateFkOrganizationInUserTable(record, transaction);
                    // Mise à jour du code DDETS en DDCS / DDCSPP dans la table stat_directory_views
                    await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
                }),
            ]),
        )),
};
