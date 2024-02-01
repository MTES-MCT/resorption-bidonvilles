/* eslint-disable no-console */

function getRegions(sequelize) {
    return sequelize.query('SELECT code, name FROM regions ORDER BY code',
        {
            type: sequelize.QueryTypes.SELECT,
        });
}

function getDepts(sequelize) {
    return sequelize.query('SELECT code, name FROM departements ORDER BY code',
        {
            type: sequelize.QueryTypes.SELECT,
        });
}

async function getOrganizationTypeCodeFromAbbreviation(sequelize, abbrev) {
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

    return mainTypes.reduce((orgaTypes, { abbreviation, organization_type_id }) => ({
        ...orgaTypes,
        [abbreviation]: organization_type_id,
    }), {});
}

async function getMatchBetweenDDCSAndDDETS(sequelize, ddcsTypeId, ddetsTypeId) {
    const matches = await sequelize.query(
        `SELECT
            ddcs.organization_id AS ddcs_id,
            ddets.organization_id AS ddets_id
        FROM organizations ddcs
        LEFT JOIN organizations ddets ON ddcs.fk_departement = ddets.fk_departement AND ddets.fk_type = :ddets_type_id
        WHERE ddcs.fk_type = :ddcs_type_id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                ddcs_type_id: ddcsTypeId,
                ddets_type_id: ddetsTypeId,
            },
        },
    );

    return matches.reduce((acc, { ddcs_id, ddets_id }) => ({
        ddcs_to_ddets: {
            ...acc.ddcs_to_ddets,
            [ddcs_id]: ddets_id,
        },
        ddets_to_ddcs: {
            ...acc.ddets_to_ddcs,
            [ddets_id]: ddcs_id,
        },
    }), {
        ddcs_to_ddets: {},
        ddets_to_ddcs: {},
    });
}

async function getMatchBetweenDireccteAndDRETS(sequelize, direccteTypeId, dretsTypeId) {
    const matches = await sequelize.query(
        `SELECT
            direccte.organization_id AS direccte_id,
            drets.organization_id AS drets_id
        FROM organizations direccte
        LEFT JOIN organizations drets ON direccte.fk_region = drets.fk_region AND drets.fk_type = :drets_type_id
        WHERE direccte.fk_type = :direccte_type_id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                direccte_type_id: direccteTypeId,
                drets_type_id: dretsTypeId,
            },
        },
    );

    return matches.reduce((acc, { direccte_id, drets_id }) => ({
        direccte_to_drets: {
            ...acc.direccte_to_drets,
            [direccte_id]: drets_id,
        },
        drets_to_direccte: {
            ...acc.drets_to_direccte,
            [drets_id]: direccte_id,
        },
    }), {
        direccte_to_drets: {},
        drets_to_direccte: {},
    });
}

function getData(sequelize) {
    return getOrganizationTypeCodeFromAbbreviation(sequelize, [
        'DDETS', 'DRETS', 'DDCS / DDCSPP', 'Direccte',
    ])
        .then(orgaTypes => Promise.all([
            orgaTypes,
            getMatchBetweenDDCSAndDDETS(sequelize, orgaTypes['DDCS / DDCSPP'], orgaTypes.DDETS),
            getMatchBetweenDireccteAndDRETS(sequelize, orgaTypes.Direccte, orgaTypes.DRETS),
        ]));
}

function replace(mapping, queryInterface, transaction) {
    return Object.keys(mapping).map(from_id => [
        queryInterface.sequelize.query(
            'UPDATE users SET fk_organization = :to_id WHERE fk_organization = :from_id',
            {
                replacements: {
                    from_id,
                    to_id: mapping[from_id],
                },
                transaction,
            },
        ),
        queryInterface.sequelize.query(
            'UPDATE stats_directory_views SET organization = :to_id WHERE organization = :from_id',
            {
                replacements: {
                    from_id,
                    to_id: mapping[from_id],
                },
                transaction,
            },
        ),
        queryInterface.sequelize.query(
            'UPDATE permissions SET fk_organization = :to_id WHERE fk_organization = :from_id',
            {
                replacements: {
                    from_id,
                    to_id: mapping[from_id],
                },
                transaction,
            },
        ),
    ]).flat();
}

async function removeTypes(type_ids, queryInterface, transaction) {
    await queryInterface.sequelize.query(
        'DELETE FROM organizations WHERE fk_type IN (:type_ids)', {
            replacements: {
                type_ids,
            },
            transaction,
        },
    );

    await queryInterface.sequelize.query(
        'DELETE FROM organization_types WHERE organization_type_id IN (:type_ids)', {
            replacements: {
                type_ids,
            },
            transaction,
        },
    );
}

function createDDCSAndDireccte(queryInterface, transaction) {
    return queryInterface.bulkInsert(
        'organization_types',
        [
            {
                abbreviation: 'DDCS / DDCSPP',
                name_singular: 'Direction Départementale de la Cohésion Sociale / Direction Départementale de la Cohésion Sociale et de la Protection des Populations',
                name_plural: 'Directions Départementales de la Cohésion Sociale / Directions Départementales de la Cohésion Sociale et de la Protection des Populations',
                fk_category: 'public_establishment',
                fk_role: 'direct_collaborator',
            },
            {
                abbreviation: 'Direccte',
                name_singular: 'Direction Régionale des Entreprises, de la Concurrence, de la Consommation, du Travail et de l\'Emploi',
                name_plural: 'Directions Régionales des Entreprises, de la Concurrence, de la Consommation, du Travail et de l\'Emploi',
                fk_category: 'public_establishment',
                fk_role: 'collaborator',
            },
        ],
    )
        .then(() => Promise.all([
            getRegions(queryInterface.sequelize),
            getDepts(queryInterface.sequelize),
            getOrganizationTypeCodeFromAbbreviation(queryInterface.sequelize, ['DDCS / DDCSPP', 'Direccte']),
        ]))
        .then(([regions, depts, orgaTypes]) => Promise.all([
            ...regions.map(region => queryInterface.sequelize.query(
                `INSERT INTO
                        organizations (name, abbreviation, active, fk_type, fk_region)
                    VALUES
                        (:organame, :abbreviation, TRUE, :fk_type, :fk_region)`,
                {
                    transaction,
                    replacements: {
                        organame: `Direction Régionale des Entreprises, de la Concurrence, de la Consommation, du Travail et de l'Emploi - ${region.name}`,
                        abbreviation: `Direccte - ${region.name}`,
                        fk_type: orgaTypes.Direccte,
                        fk_region: region.code,
                    },
                },
            )),
            ...depts.map(dept => queryInterface.sequelize.query(
                `INSERT INTO
                        organizations (name, abbreviation, active, fk_type, fk_departement)
                    VALUES
                        (:organame, :abbreviation, TRUE, :fk_type, :fk_departement)`,
                {
                    transaction,
                    replacements: {
                        organame: `Direction Départementale de la Cohésion Sociale / Direction Départementale de la Cohésion Sociale et de la Protection des Populations - ${dept.name}`,
                        abbreviation: `DDCS / DDCSPP - ${dept.name}`,
                        fk_type: orgaTypes['DDCS / DDCSPP'],
                        fk_departement: dept.code,
                    },
                },
            )),
        ]));
}

module.exports = {
    up: queryInterface => getData(queryInterface.sequelize)
        .then(([orgaTypes, { ddcs_to_ddets }, { direccte_to_drets }]) => queryInterface.sequelize.transaction(
            transaction => Promise.all([
                ...replace(ddcs_to_ddets, queryInterface, transaction),
                ...replace(direccte_to_drets, queryInterface, transaction),
            ])
                .then(() => removeTypes(
                    [orgaTypes['DDCS / DDCSPP'], orgaTypes.Direccte],
                    queryInterface,
                    transaction,
                ))
                .then(() => queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', {
                    transaction,
                })),
        ))
        .catch((error) => {
            console.log(error);
            throw error;
        }),

    down: queryInterface => createDDCSAndDireccte(queryInterface)
        .then(() => getData(queryInterface.sequelize))
        .then(([, { ddets_to_ddcs }, { drets_to_direccte }]) => queryInterface.sequelize.transaction(
            transaction => Promise.all([
                ...replace(ddets_to_ddcs, queryInterface, transaction),
                ...replace(drets_to_direccte, queryInterface, transaction),
            ])
                .then(() => queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', {
                    transaction,
                })),
        )),
};
