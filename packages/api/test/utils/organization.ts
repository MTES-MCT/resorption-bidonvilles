import { Organization } from '#root/types/resources/Organization.d';

export function serialized(override: Partial<Organization> = {}): Organization {
    const defaultObj:Organization = {
        id: 2,
        name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
        abbreviation: 'DIHAL',
        being_funded: false,
        being_funded_at: new Date(),
        intervention_areas: {
            is_national: false,
            areas: [{
                type: 'departement',
                area_of: 'organization',
                is_main_area: true,
                latitude: 0,
                longitude: 1,
                city: null,
                epci: null,
                departement: {
                    code: '78',
                    name: 'Yvelines',
                },
                region: {
                    code: '11',
                    name: 'Île-De-France',
                },
            }],
        },
        type: {
            id: 10,
            category: 'national_establisment',
            name: 'Délégation interministérielle',
            abbreviation: null,
        },
        users: [],
    };

    return Object.assign(defaultObj, override);
}

export default serialized;
