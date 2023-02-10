export default function fakePermissionsToAccessJustice() {
    const commonPermissions = {
        name: 'Orgnaisation 02',
        abbreviation: 'ORGA2',
        location_type: 'departement',
        region_code: '93',
        region_name: "Provence-Alpes-Côte d'Azur",
        departement_code: '13',
        departement_name: 'Bouches-du-Rhône',
        epci_code: null,
        epci_name: null,
        city_code: null,
        city_name: null,
        city_main: null,
        being_funded: false,
        being_funded_at: null,
        type_id: 8,
        type_category: 'association',
        type_name: 'Association',
        type_abbreviation: null,
        fk_entity: 'shantytown_justice',
        fk_feature: 'access',
        allowed: true,
        permission_options: [
            'access_justice',
        ],
        permissions: {
            shantytown_justice: {
                access: {
                    is_writing: false,
                    allowed: true,
                    allow_all: false,
                    allowed_on: {
                        regions: [

                        ],
                        departements: [
                            '13',
                        ],
                        epci: [

                        ],
                        cities: [

                        ],
                        shantytowns: [

                        ],
                        plans: [

                        ],
                    },
                },
            },
        },
    };

    const permissions = [
        {
            level: 'option',
            user_id: 2,
            first_name: 'Annie',
            last_name: 'DUCHEMIN',
            fk_status: 'active',
            to_be_tracked: true,
            fk_role: 'association',
            fk_role_regular: 'association',
            id: 2,
            ...commonPermissions,
        },
        {
            level: 'option',
            user_id: 3,
            first_name: 'Martin',
            last_name: 'DURAND',
            fk_status: 'active',
            to_be_tracked: true,
            fk_role: 'association',
            fk_role_regular: 'association',
            id: 3,
            ...commonPermissions,
        },
    ];
    return permissions;
}
