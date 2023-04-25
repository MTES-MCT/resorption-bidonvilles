import { ActionFinancesReaderRow } from '#server/models/actionModel/findActionFinancesReaders/findActionFinancesReaders';

export default function raw(): ActionFinancesReaderRow {
    return {
        user_id: 2,
        email: 'martin@dupond.fr',
        first_name: 'Martin',
        last_name: 'Dupond',
        phone: '0102030405',
        position: 'Test',
        role_admin: null,
        role_regular: 'association',
        id: 1,
        name: 'Organisation 03',
        abbreviation: 'ORGA3',
        location_type: 'departement',
        being_funded: false,
        being_funded_at: new Date(),
        region_code: '11',
        region_name: 'Île-de-France',
        departement_code: '77',
        departement_name: 'Seine-et-Marne',
        epci_code: null,
        epci_name: null,
        city_code: null,
        city_name: null,
        city_main: null,
        type_id: 8,
        type_category: 'association',
        type_name: 'Association',
        type_abbreviation: null,
    };
}
