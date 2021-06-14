/* eslint-disable no-console */
const { sequelize } = require('../models');

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
                                    abbreviation in (:abbreviation)`,
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
    up: (queryInterface, Sequelize) => Promise.all([
        getRegions(queryInterface, Sequelize),
        getDepts(queryInterface, Sequelize),
        getOrganizationTypeCodeFromAbbreviation(['DDETS', 'DRETS']),
    ]).then((data) => {
        const regions = [...data[0]];
        const depts = [...data[1]];
        const orgaTypes = { ...data[2].orgaTypes };

        if (Object.keys(orgaTypes).length === 0) {
            throw new Error('Organisazations types DDETS and DRETS are needed to populate organizations table');
        } else if (!Object.keys(orgaTypes).includes('DRETS')) {
            throw new Error('Can\'t populate organizations with DRETS if DRETS organization\'s type doesn\'t exist');
        } else if (!Object.keys(orgaTypes).includes('DDETS')) {
            throw new Error('Can\'t populate organizations with DDETS if DDETS organization\'s type doesn\'t exist');
        }
        if (Object.keys(regions).length < 1) {
            throw new Error('regions table is empty - unable to create DRETS');
        } else if (Object.keys(depts).length < 1) {
            throw new Error('departements table is empty - unable to create DDETS');
        } else {
            return queryInterface.sequelize.transaction(
                transaction => Promise.all([
                    regions.forEach(async (region) => {
                        queryInterface.sequelize.query(
                            `INSERT INTO
                                organizations (name, abbreviation, active, fk_type, fk_region)
                            VALUES
                                (:organame, :abbreviation, TRUE, :fk_type, :fk_region)`,
                            {
                                transaction,
                                replacements:
                                    {
                                        organame: `Direction Régionale de l'Emploi, du Travail et des Solidarités - ${region.name}`,
                                        abbreviation: `DRETS - ${region.name}`,
                                        fk_type: data[2].orgaTypes.DRETS,
                                        fk_region: region.code,
                                    },
                            },
                        );
                    }),
                    depts.forEach(async (dept) => {
                        queryInterface.sequelize.query(
                            `INSERT INTO
                                organizations (name, abbreviation, active, fk_type, fk_departement)
                            VALUES
                                (:organame, :abbreviation, TRUE, :fk_type, :fk_departement)`,
                            {
                                replacements:
                                    {
                                        organame: `Direction Départementale de l'Emploi, du Travail et des Solidarités - ${dept.name}`,
                                        abbreviation: `DDETS - ${dept.name}`,
                                        fk_type: data[2].orgaTypes.DDETS,
                                        fk_departement: dept.code,
                                    },
                            },
                        );
                    }),
                ]),
            );
        }
    }),

    down: queryInterface => getOrganizationTypeCodeFromAbbreviation(['DDETS', 'DRETS'])
        .then(data => queryInterface.sequelize.transaction(
            transaction => Promise.all([
                queryInterface.sequelize.query(
                    // Suppression des organizations de type DRETS et DDETS
                    'DELETE FROM organizations WHERE fk_type IN (:fk_type_drets, :fk_type_ddets)',
                    {
                        replacements:
                            {
                                fk_type_drets: data.orgaTypes.DRETS,
                                fk_type_ddets: data.orgaTypes.DDETS,
                            },
                    },
                    transaction,
                ),
            ]),
        )),
};
