/* eslint-disable newline-per-chained-call,no-await-in-loop, no-restricted-syntax */
require('module-alias/register');
const crypto = require('crypto');
const { create } = require('#server/models/organizationModel')();
const { setPermissionOptions } = require('#server/models/userModel')();

function generate({
    email, password, first_name, last_name, fk_role, phone, position, fk_organization, fk_role_regular,
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
        fk_role_regular,
    };
}

const users = [
    {
        user: generate({
            email: 'qa-city@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'City (Collaborator)',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
            fk_role_regular: 'collaborator',
        }),
        organization: {
            name: 'QA commune',
            abbreviation: 'QA commune',
            type: 4, // commune
            region: null,
            departement: null,
            epci: null,
            city: 33063, // bordeaux
        },
        options: [],
    },
    {
        user: generate({
            email: 'qa-asso-city@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Asso city',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
            fk_role_regular: 'association',
        }),
        organization: {
            name: 'QA asso city',
            abbreviation: 'QA asso city',
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
            email: 'qa-asso-city-with-create-option@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Asso city with create option',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
            fk_role_regular: 'association',
        }),
        organization: {
            name: 'Asso city with create option',
            abbreviation: 'QA city',
            type: 8, // association
            region: null,
            departement: null,
            epci: null,
            city: 33063, // bordeaux
        },
        options: ['create_and_close_shantytown'],
    },
    {
        user: generate({
            email: 'qa-asso-departement@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Asso departement',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
            fk_role_regular: 'association',
        }),
        organization: {
            name: 'QA asso departement',
            abbreviation: 'QA asso departement',
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
            email: 'qa-asso-departement-with-hide-justice-option@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Asso departement with hide justice option',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
            fk_role_regular: 'association',
        }),
        organization: {
            name: 'QA asso Departement with hide justice option',
            abbreviation: 'QA asso Departement with hide justice option',
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
            email: 'qa-asso-region@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'Asso region',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
            fk_role_regular: 'association',
        }),
        organization: {
            name: 'QA asso region',
            abbreviation: 'QA asso region',
            type: 8, // association
            region: 75,
            departement: null,
            epci: null,
            city: null,
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
            fk_role_regular: 'direct_collaborator',
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
            fk_role_regular: 'intervener',
        }),
        organization: {
            name: 'QA intervenant',
            abbreviation: 'QA intervenant',
            type: 8, // association
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
            fk_role_regular: 'national_establisment',
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
            fk_role_regular: 'association',
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
            fk_role_regular: 'association',
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
    {
        user: generate({
            email: 'qa-external-observator@resorption-bidonvilles.beta.gouv.fr',
            password: 'fabnum',
            first_name: 'QA',
            last_name: 'external observator',
            fk_role: null,
            phone: '00 00 00 00 00',
            position: 'qa',
            fk_role_regular: 'external_observator',
        }),
        organization: 40760, // dihal
        options: [],
    },
];

module.exports = {
    up: async (queryInterface) => {
        for (const user of users) {
            let fk_organization;
            if (typeof user.organization === 'object') {
                const [[{ id }]] = await create(user.organization.name, user.organization.abbreviation, user.organization.type, user.organization.region, user.organization.departement, user.organization.epci, user.organization.city, true);
                fk_organization = id;
            } else {
                fk_organization = user.organization;
            }

            await queryInterface.bulkInsert('users', [{ ...user.user, fk_organization }]);

            if (user.options.length) {
                const [[{ user_id }]] = await queryInterface.sequelize.query(
                    `SELECT user_id FROM users 
                WHERE users.email = :email;`,
                    {
                        replacements: {
                            email: user.user.email,
                        },
                    },
                );
                await setPermissionOptions(user_id, user.options);
            }
        }
    },

    down: (queryInterface) => {
        const emails = users.map(u => u.user.email);

        return queryInterface.sequelize.transaction(
            async (transaction) => {
                const [result] = await queryInterface.sequelize.query(
                    `SELECT user_id FROM users 
                WHERE users.email in (:emails);`,
                    {
                        transaction,
                        replacements: {
                            emails,
                        },
                    },
                );

                const userIds = result.map(r => r.user_id);

                if (userIds.length) {
                    await queryInterface.sequelize.query(
                        `DELETE FROM user_permission_options 
                    WHERE fk_user in (:userIds);`,
                        {
                            transaction,
                            replacements: {
                                userIds,
                            },
                        },
                    );

                    await queryInterface.sequelize.query(
                        `DELETE FROM users 
                    WHERE user_id in (:userIds);`,
                        {
                            transaction,
                            replacements: {
                                userIds,
                            },
                        },
                    );
                }
            },
        );
    },
};
