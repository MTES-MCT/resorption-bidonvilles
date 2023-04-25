import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export function serialized(override: Partial<SerializedOrganization> = {}): SerializedOrganization {
    const defaultObj:SerializedOrganization = {
        id: 2,
        name: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
        abbreviation: 'DIHAL',
        being_funded: false,
        being_funded_at: new Date(),
        location: {
            type: 'departement',
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
