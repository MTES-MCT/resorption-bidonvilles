/* eslint-disable key-spacing */
/* eslint-disable no-console */
const { sequelize } = require('../models');

/**
 * @param {String} authorityLevel the local authority level required (region or departement)
 * @returns {String} a query string
 */
function buildQueryString(whichRequest, authorityLevel, upOrDown) {
    let foreign_key;
    let where_clause1;
    let where_clause2;
    let sqlString;
    if (authorityLevel === 'region') {
        foreign_key = 'o.fk_region';
        if (upOrDown === 'up') {
            where_clause1 = 'UPPER(ot.abbreviation) = \'DIRECCTE\'';
            where_clause2 = 'UPPER(ot.abbreviation) = \'DRETS\'';
        }
        if (upOrDown === 'down') {
            where_clause1 = 'UPPER(ot.abbreviation) = \'DRETS\'';
            where_clause2 = 'UPPER(ot.abbreviation) = \'DIRECCTE\'';
        }
    }
    if (authorityLevel === 'departement') {
        foreign_key = 'o.fk_departement';
        if (upOrDown === 'up') {
            where_clause1 = 'UPPER(ot.abbreviation) = \'DDCS / DDCSPP\'';
            where_clause2 = 'UPPER(ot.abbreviation) = \'DDETS\'';
        }
        if (upOrDown === 'down') {
            where_clause1 = 'UPPER(ot.abbreviation) = \'DDETS\'';
            where_clause2 = 'UPPER(ot.abbreviation) = \'DDCS / DDCSPP\'';
        }
    }

    if (whichRequest !== 'organizations' && whichRequest !== 'statistiques') {
        throw new Error('sqlString can be built exwclusively for organizations or statistiques');
    }

    if (whichRequest === 'organizations') {
        sqlString = `SELECT
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

    if (whichRequest === 'statistiques') {
        sqlString = `SELECT
                        ORGA_OLD.old_orga_id,
                        ORGA_OLD.old_orga_abbreviation,
                        ORGA_OLD.old_fk_orga_level,
                        ORGA_NEW.new_orga_id,
                        ORGA_NEW.new_orga_abbreviation,
                        ORGA_NEW.new_fk_orga_level
                    FROM
                        (
                            SELECT
                                st.organization AS old_orga_id,
                                UPPER(ot.abbreviation) AS old_orga_abbreviation,
                                ${foreign_key} AS old_fk_orga_level
                            FROM
                                    stats_directory_views st
                            LEFT JOIN
                                    organizations o
                                        ON o.organization_id = st.organization
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
    return sqlString;
}

/**
 * Returns old ids for departemental (DDCS/DDCSP) and regional (DIRECCTE) organizations
 * and new ids for what they are now: DDETS as departemental and DRETS as regional organizations
 * @param {string} authorityLevel The level of the local authority (region or departement)
 */
function getOrganizationsCorrespondence(queryInterface, whichRequest, authorityLevel, upOrDown) {
    return sequelize.query(buildQueryString(whichRequest, authorityLevel, upOrDown),
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
        `   UPDATE stats_directory_views
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

/**
 * Return regions
 */
function getRegions() {
    return sequelize.query('SELECT code, name FROM regions ORDER BY code',
        {
            type: sequelize.QueryTypes.SELECT,
        });
}

/**
 * Return departements
 */
function getDepts() {
    return sequelize.query('SELECT code, name FROM departements ORDER BY code',
        {
            type: sequelize.QueryTypes.SELECT,
        });
}

/**
 * Gets DRETS and DRETS organization type codes
 */
async function getOrganizationTypeCodeFromAbbreviation(abbrev) {
    const mainTypes = await sequelize.query(`SELECT
                                    organization_type_id,
                                    abbreviation
                            FROM
                                    organization_types
                            WHERE
                                    UPPER(abbreviation) in (:abbreviation)`,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            abbreviation: abbrev,
        },
    });
    const data = {
        orgaTypes: {},
    };
    mainTypes.forEach((orgaType) => {
        data.orgaTypes[orgaType.abbreviation] = orgaType.organization_type_id;
    });
    return data;
}

module.exports = {
    up: queryInterface => Promise.all([
        getOrganizationsCorrespondence(queryInterface, 'organizations', 'region', 'up'),
        getOrganizationsCorrespondence(queryInterface, 'organizations', 'departement', 'up'),
        getOrganizationsCorrespondence(queryInterface, 'statistiques', 'region', 'up'),
        getOrganizationsCorrespondence(queryInterface, 'statistiques', 'departement', 'up'),
    ])
        .then(data => queryInterface.sequelize.transaction(
            transaction => Promise.all([
                data[0].forEach(async (record) => {
                    // Mise à jour du code organisation des utilisateurs Direccte en DRETS
                    await updateFkOrganizationInUserTable(record, transaction);
                }),
                data[1].forEach(async (record) => {
                    // Mise à jour du code organisation des utilisateurs DDCS / DDCSPP en DDETS
                    await updateFkOrganizationInUserTable(record, transaction);
                }),
                data[2].forEach(async (record) => {
                    // Mise à jour du code Direccte en DRETS dans la table stat_directory_views
                    await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
                }),
                data[3].forEach(async (record) => {
                    // Mise à jour du code DDCS / DDCSPP en DDETS dans la table stat_directory_views
                    await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
                }),
                // Suppression des organisations de types DDCS / DDCSPP et Direccte
                queryInterface.sequelize.query(
                    'DELETE FROM organizations WHERE fk_type IN (SELECT organization_type_id FROM organization_types WHERE UPPER(abbreviation) IN (\'DDCS / DDCSPP\', \'DIRECCTE\'))',
                    {
                        transaction,
                    },
                ),
                // Suppression des types d'organisations DDCS / DDCSPP et Direccte
                queryInterface.sequelize.query(
                    'DELETE FROM organization_types WHERE UPPER(abbreviation) IN (\'DDCS / DDCSPP\', \'DIRECCTE\')',
                    {
                        transaction,
                    },
                ),
            ]),
        )),

    down: queryInterface => Promise.all([
        // Créer les types d'organisations DDCS / DDCSPP et Direccte
        queryInterface.bulkInsert(
            'organization_types',
            [
                {
                    abbreviation:   'DDCS / DDCSPP',
                    name_singular:  'Direction Départementale de la Cohésion Sociale / Direction Départementale de la Cohésion Sociale et de la Protection des Populations',
                    name_plural:    'Directions Départementales de la Cohésion Sociale / Directions Départementales de la Cohésion Sociale et de la Protection des Populations',
                    fk_category:    'public_establishment',
                    fk_role:        'direct_collaborator',
                },
                {
                    abbreviation:   'Direccte',
                    name_singular:  'Direction Régionale des Entreprises, de la Concurrence, de la Consommation, du Travail et de l\'Emploi',
                    name_plural:    'Directions Régionales des Entreprises, de la Concurrence, de la Consommation, du Travail et de l\'Emploi',
                    fk_category:    'public_establishment',
                    fk_role:        'collaborator',
                },
            ],
        ),
        getRegions(),
        getDepts(),
        getOrganizationTypeCodeFromAbbreviation(['DDCS / DDCSPP', 'DIRECCTE']),
    ])
        .then((data) => {
            const regions = [...data[1]];
            const depts = [...data[2]];
            const organizationTypes = { ...data[3].orgaTypes };
            console.log('==================================================================');
            console.log('data:');
            regions.forEach(async (region) => {
                console.log(region);
            });
            console.log('==================================================================');
            depts.forEach(async (dept) => {
                console.log(dept);
            });
            console.log('==================================================================');
            console.log(data[3].orgaTypes);
            console.log(organizationTypes);
            if (Object.keys(organizationTypes).length === 0) {
                throw new Error('Organizations types DDCS / DDCSPP and DIRECCTE are needed to populate organizations table');
            } else if (!Object.keys(organizationTypes).includes('Direccte')) {
                throw new Error('Can\'t populate organizations with Direccte if Direccte organization\'s type doesn\'t exist');
            } else if (!Object.keys(organizationTypes).includes('DDCS / DDCSPP')) {
                throw new Error('Can\'t populate organizations with DDCS / DDCSPP if DDCS / DDCSPP organization\'s type doesn\'t exist');
            }
            if (Object.keys(regions).length < 1) {
                throw new Error('regions table is empty - unable to create Direccte');
            } else if (Object.keys(depts).length < 1) {
                throw new Error('departements table is empty - unable to create DDCS / DDCSPP');
            } else {
                return queryInterface.sequelize.transaction(
                    transaction => Promise.all([
                        regions.forEach(async (region) => {
                            await queryInterface.sequelize.query(
                                `INSERT INTO
                                    organizations (name, abbreviation, active, fk_type, fk_region)
                                VALUES
                                    (:organame, :abbreviation, TRUE, :fk_type, :fk_region)`,
                                {
                                    transaction,
                                    replacements:
                                        {
                                            organame: `Direction Régionale des Entreprises, de la Concurrence, de la Consommation, du Travail et de l'Emploi - ${region.name}`,
                                            abbreviation: `Direccte - ${region.name}`,
                                            fk_type: data[3].orgaTypes.Direccte,
                                            fk_region: region.code,
                                        },
                                },
                            );
                        }),
                        depts.forEach(async (dept) => {
                            await queryInterface.sequelize.query(
                                `INSERT INTO
                                    organizations (name, abbreviation, active, fk_type, fk_departement)
                                VALUES
                                    (:organame, :abbreviation, TRUE, :fk_type, :fk_departement)`,
                                {
                                    transaction,
                                    replacements:
                                        {
                                            organame: `Direction Départementale de la Cohésion Sociale / Direction Départementale de la Cohésion Sociale et de la Protection des Populations - ${dept.name}`,
                                            abbreviation: `DDCS / DDCSPP - ${dept.name}`,
                                            fk_type: data[3].orgaTypes['DDCS / DDCSPP'],
                                            fk_departement: dept.code,
                                        },
                                },
                            );
                        }),
                    ]),
                );
            }
        })
        .then(
            Promise.all([
                // Récupérer les tables de correspondance anciennes structures / nouvelles structures
                getOrganizationsCorrespondence(queryInterface, 'organizations', 'region', 'down'),
                getOrganizationsCorrespondence(queryInterface, 'organizations', 'departement', 'down'),
                getOrganizationsCorrespondence(queryInterface, 'statistiques', 'region', 'down'),
                getOrganizationsCorrespondence(queryInterface, 'statistiques', 'departement', 'down'),
            ])
                .then((data) => {
                    console.log(data[0]);
                    console.log(data[1]);
                    console.log(data[2]);
                    console.log(data[3]);
                }),
            // .then(data => queryInterface.sequelize.transaction(
            //     transaction => Promise.all([
            //         data[0].forEach(async (record) => {
            //             // Mise à jour du code organisation des utilisateurs DRETS en Direccte
            //             await updateFkOrganizationInUserTable(record, transaction);
            //         }),
            //         data[1].forEach(async (record) => {
            //             // Mise à jour du code organisation des utilisateurs DDETS en DDCS / DDCSPP
            //             await updateFkOrganizationInUserTable(record, transaction);
            //         }),
            //         data[2].forEach(async (record) => {
            //             // Mise à jour du code DDETS en DDCS / DDCSPP dans la table stat_directory_views
            //             await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
            //         }),
            //         data[3].forEach(async (record) => {
            //             // Mise à jour du code DRETS en Direccte dans la table stat_directory_views
            //             await updateFkOrganizationInStatDirectoryViewsTable(record, transaction);
            //         }),
            //         // Suppression des organisations de types DRETS et DDETS
            //         queryInterface.sequelize.query(
            //             'DELETE FROM organizations WHERE fk_type IN (SELECT organization_type_id FROM organization_types WHERE UPPER(abbreviation) IN (\'DRETS\', \'DDETS\'))',
            //             {
            //                 transaction,
            //             },
            //         ),
            //         // Suppression des types d'organisations DRETS et DDETS
            //         queryInterface.sequelize.query(
            //             'DELETE FROM organization_types WHERE UPPER(abbreviation) IN (\'DRETS\', \'DDETS\')',
            //             {
            //                 transaction,
            //             },
            //         ),
            //     ]),
            // )),
        ),
};
