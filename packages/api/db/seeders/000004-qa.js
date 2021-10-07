/* eslint-disable newline-per-chained-call,no-await-in-loop, no-restricted-syntax */
const crypto = require('crypto');
const { sequelize } = require('../../db/models/index');
const organizationModel = require('../../server/models/organizationModel')(sequelize);

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
            const [[{ id: fk_organization }]] = await organizationModel.create(user.organization.name, user.organization.abbreviation, user.organization.type, user.organization.region, user.organization.departement, user.organization.epci, user.organization.city, true);
            await queryInterface.bulkInsert('users', [{ ...user.user, fk_organization }]);
            if (user.options.length) {
                const permissions = fromOptionsToPermissions({ permissions: {} }, user.options);
                console.log(user.options, permissions);
                await organizationModel.setCustomPermissions(fk_organization, permissions);
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
