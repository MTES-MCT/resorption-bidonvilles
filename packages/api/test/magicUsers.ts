

export default {
    'national_admin': {
        user_id: 1000000,
        email: 'national_admin.qa@resorption-bidonvilles.beta.gouv.fr',
        first_name: 'Administrateur',
        last_name: 'National',
        position: 'Compte de QA',
        role_regular: ''
    },
    'local_admin': {
        user_id: 1000000,
        email: 'local_admin.qa@resorption-bidonvilles.beta.gouv.fr',
    },
    'direct_collaborator': {
        user_id: 1000000,
        email: 'direct_collaborator.qa@resorption-bidonvilles.beta.gouv.fr',
    },
    'collaborator_city': {
        user_id: 1000000,
        email: 'collaborator_city.qa@resorption-bidonvilles.beta.gouv.fr',
    },
    'collaborator_region': {
        user_id: 1000000,
        email: 'collaborator_region.qa@resorption-bidonvilles.beta.gouv.fr',
    },
    'association': {
        user_id: 1000000,
        email: 'association.qa@resorption-bidonvilles.beta.gouv.fr',
    },
    'national_establishment': {
        user_id: 1000000,
        email: 'national_establishment.qa@resorption-bidonvilles.beta.gouv.fr',
    },
    'intervener': {
        user_id: 1000000,
        email: 'intervener.qa@resorption-bidonvilles.beta.gouv.fr',
    },
    'external_observator': {
        user_id: 1000000,
        email: 'external_observator.qa@resorption-bidonvilles.beta.gouv.fr',
    },

    'collaborator_city': {
        
        email: 'qa-city@resorption-bidonvilles.beta.gouv.fr',
        password: 'fabnum',
        first_name: 'QA',
        last_name: 'City (Collaborator)',
        fk_role: null,
        phone: '00 00 00 00 00',
        position: 'qa',
        fk_role_regular: 'collaborator',
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
    'association': {
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
        },
        ,
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
                email: 'qa-asso-departement-with-access-justice-option@resorption-bidonvilles.beta.gouv.fr',
                password: 'fabnum',
                first_name: 'QA',
                last_name: 'Asso departement with access justice option',
                fk_role: null,
                phone: '00 00 00 00 00',
                position: 'qa',
                fk_role_regular: 'association',
            }),
            organization: {
                name: 'QA asso Departement with hide justice option',
                abbreviation: 'QA asso Departement with access justice option',
                type: 8, // association
                region: null,
                departement: 33,
                epci: null,
                city: null, // bordeaux
            },
            options: ['access_justice'],
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
            organization: 'Préfecture de département - Gironde',
            options: ['access_justice'],
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
            organization: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
            options: ['access_justice'],
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
            options: ['access_justice'],
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
            options: ['access_justice'],
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
            organization: {
                name: 'QA external_observator',
                abbreviation: 'QA external_observator',
                type: 8, // association
                region: null,
                departement: 33,
                epci: null,
                city: null,
            },
            options: [],
        },
    ];
}