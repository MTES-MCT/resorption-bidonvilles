/* eslint-disable newline-per-chained-call,no-await-in-loop, no-restricted-syntax */
const crypto = require('crypto');
const { sequelize } = require('../../db/models/index');

function generate({
    email, password, first_name, last_name, fk_role, phone, position, fk_organization,
}) {
    const salt = crypto.randomBytes(16).toString('hex');

    return {
        email,
        password: crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex'),
        salt,
        first_name,
        last_name,
        fk_role,
        fk_status: 'active',
        access_request_message: 'Compte généré automatiquement',
        phone,
        position,
        fk_organization,
        charte_engagement_signee: 2,
    };
}

function fromOptionToPermissions(user, option, dataJustice) {
    switch (option.id) {
        case 'close_shantytown':
            return [
                {
                    entity: 'shantytown',
                    feature: 'close',
                    level: 'local',
                    data: { data_justice: dataJustice },
                    allowed: true,
                },
            ];

        case 'create_and_close_shantytown':
            return [
                {
                    entity: 'shantytown',
                    feature: 'create',
                    level: 'local',
                    data: { data_justice: dataJustice },
                    allowed: true,
                },
                {
                    entity: 'shantytown',
                    feature: 'close',
                    level: 'local',
                    data: { data_justice: dataJustice },
                    allowed: true,
                },
            ];

        case 'hide_justice': {
            const defaultPermissions = user.permissions.shantytown || {};

            return Object.keys(defaultPermissions).map(feature => ({
                entity: 'shantytown',
                feature,
                level: defaultPermissions[feature].geographic_level,
                data: { data_justice: false },
                allowed: defaultPermissions[feature].allowed,
            }));
        }

        default:
            return [];
    }
}

function fromOptionsToPermissions(user, options) {
    if (options.length === 0) {
        return [];
    }

    // special case of data_justice
    const dataJustice = options.find(({ id }) => id === 'hide_justice') === undefined;

    return options.reduce((permissions, option) => [
        ...permissions,
        ...fromOptionToPermissions(user, option, dataJustice),
    ], []);
}

const createOrganization = async (name, abbreviation = null, type, region = null, departement = null, epci = null, city = null, active = false, argTransaction = undefined) => {
    let transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }

    const response = await sequelize.query(
        `INSERT INTO
        organizations(name, abbreviation, fk_type, fk_region, fk_departement, fk_epci, fk_city, active)
    VALUES
        (:name, :abbreviation, :type, :region, :departement, :epci, :city, :active)
    RETURNING organization_id AS id`,
        {
            replacements: {
                name,
                abbreviation,
                type,
                region,
                departement,
                epci,
                city,
                active,
            },
            transaction,
        },
    );
    await sequelize.query(
        'REFRESH MATERIALIZED VIEW localized_organizations',
        {
            transaction,
        },
    );

    if (argTransaction === undefined) {
        await transaction.commit();
    }

    return response;
};

const setCustomPermissions = async (organizationId, permissions) => sequelize.transaction(
    t => sequelize.query('DELETE FROM permissions WHERE fk_organization = :organizationId', {
        transaction: t,
        replacements: {
            organizationId,
        },
    })
        .then(() => Promise.all(
            permissions.map(permission => sequelize.query(
                `INSERT INTO
                            permissions(fk_organization, fk_role_admin, fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
                        VALUES
                            (:organizationId, NULL, NULL, :feature, :entity, :allowed, :level)
                        RETURNING permission_id`,
                {
                    transaction: t,
                    replacements: {
                        organizationId,
                        feature: permission.feature,
                        entity: permission.entity,
                        level: permission.level,
                        allowed: permission.allowed,
                    },
                },
            )
                .then(([[{ permission_id: permissionId }]]) => {
                    const replacements = Object.assign({ fk_permission: permissionId }, permission.data || {});
                    return sequelize.query(
                        `INSERT INTO ${permission.entity}_permissions VALUES (${Object.keys(replacements).map(name => `:${name}`).join(',')})`,
                        {
                            transaction: t,
                            replacements,
                        },
                    );
                })),
        )),
);

const users = [
    {
        user: generate({
            email: 'qa-city@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'City',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA city',
            abbreviation: 'QA city',
            type: 8, // association
            region: null,
            departement: null,
            epci: null,
            city: 33063, // bordeaux
        },
        options: [],
    },
    {
        user: generate({
            email: 'qa-city-with-create-option@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'City',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA city',
            abbreviation: 'QA city',
            type: 8, // association
            region: null,
            departement: null,
            epci: null,
            city: 33063, // bordeaux
        },
        options: [{ id: 'create_and_close_shantytown' }],
    },
    {
        user: generate({
            email: 'qa-departement@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Departement',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA departement',
            abbreviation: 'QA departement',
            type: 8, // association
            region: null,
            departement: 33,
            epci: null,
            city: null, // bordeaux
        },
        options: [],
    },
    {
        user: generate({
            email: 'qa-departement-with-hide-justice-option@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Departement',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA departement',
            abbreviation: 'QA departement',
            type: 8, // association
            region: null,
            departement: 33,
            epci: null,
            city: null, // bordeaux
        },
        options: ['hide_justice'],
    },
    {
        user: generate({
            email: 'qa-region@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Region',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA region',
            abbreviation: 'QA region',
            type: 8, // association
            region: 75,
            departement: null,
            epci: null,
            city: null, // bordeaux
        },
        options: [],
    },
    {
        user: generate({
            email: 'qa-prefecture@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'prefecture',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: 31, // Prefecture de département gironde
        options: [],
    },
    {
        user: generate({
            email: 'qa-intervenant@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'observator',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA intervenant',
            abbreviation: 'QA intervenant',
            type: 31, // intervenant
            region: null,
            departement: 33,
            epci: null,
            city: null,
        },
        options: [],
    },
    {
        user: generate({
            email: 'qa-national@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'national',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: 40760, // dihal
        options: [],
    },
    {
        user: generate({
            email: 'qa-local-admin@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'local admin',
            fk_role: 'local_admin',
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA local admin',
            abbreviation: 'QA  local admin',
            type: 8, // association
            region: null,
            departement: 33,
            epci: null,
            city: null, // bordeaux
        },
        options: [],
    },
    {
        user: generate({
            email: 'qa-national-admin@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'national admin',
            fk_role: 'national_admin',
            phone: '00 00 00 00 00',
            position: 'qa',
        }),
        organization: {
            name: 'QA national admin',
            abbreviation: 'QA national admin',
            type: 8, // association
            region: null,
            departement: 33,
            epci: null,
            city: null, // bordeaux
        },
        options: [],
    },
];

module.exports = {
    up: async (queryInterface) => {
        for (const user of users) {
            let fk_organization;
            if (typeof user.organization === 'object') {
                const [[{ id }]] = await createOrganization(user.organization.name, user.organization.abbreviation, user.organization.type, user.organization.region, user.organization.departement, user.organization.epci, user.organization.city, true);
                fk_organization = id;
            } else {
                fk_organization = user.organization;
            }

            await queryInterface.bulkInsert('users', [{ ...user.user, fk_organization }]);
            if (user.options.length) {
                const permissions = fromOptionsToPermissions({ permissions: {} }, user.options);
                await setCustomPermissions(fk_organization, permissions);
            }
        }
    },

    down: (queryInterface) => {
        const emails = users.map(u => u.user.email);


        return queryInterface.sequelize.transaction(
            transaction => queryInterface.sequelize.query(
                `DELETE FROM users 
            WHERE users.email in (:emails);`,
                {
                    transaction,
                    replacements: {
                        emails,
                    },
                },
            ),
        );
    },
};
