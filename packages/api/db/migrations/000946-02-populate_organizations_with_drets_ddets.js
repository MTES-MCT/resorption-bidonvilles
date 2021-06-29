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
    const mainTypes = await sequelize.query(
        `SELECT
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
        },
    );

    return mainTypes.reduce((orgatypes, { abbreviation, organization_type_id }) => ({
        ...orgatypes,
        [abbreviation]: organization_type_id,
    }), {});
}

module.exports = {
    up: queryInterface => Promise.all([
        getRegions(),
        getDepts(),
        getOrganizationTypeCodeFromAbbreviation(['DDETS', 'DRETS']),
    ]).then(([regions, depts, orgaTypes]) => {
        // Création des organisations de type DRETS et DDETS

        if (Object.keys(orgaTypes).length === 0) {
            throw new Error('Organizations types DDETS and DRETS are needed to populate organizations table');
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
                    regions.forEach((region) => {
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
                                        fk_type: orgaTypes.DRETS,
                                        fk_region: region.code,
                                    },
                            },
                        );
                    }),
                    depts.forEach((dept) => {
                        queryInterface.sequelize.query(
                            `INSERT INTO
                                organizations (name, abbreviation, active, fk_type, fk_departement)
                            VALUES
                                (:organame, :abbreviation, TRUE, :fk_type, :fk_departement)`,
                            {
                                transaction,
                                replacements:
                                    {
                                        organame: `Direction Départementale de l'Emploi, du Travail et des Solidarités - ${dept.name}`,
                                        abbreviation: `DDETS - ${dept.name}`,
                                        fk_type: orgaTypes.DDETS,
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
        .then(orgaTypes => queryInterface.sequelize.query(
            // Suppression des organizations de type DRETS et DDETS
            'DELETE FROM organizations WHERE fk_type IN (:fk_type_drets, :fk_type_ddets)',
            {
                replacements:
                    {
                        fk_type_drets: orgaTypes.DRETS,
                        fk_type_ddets: orgaTypes.DDETS,
                    },
            },
        )),
};
