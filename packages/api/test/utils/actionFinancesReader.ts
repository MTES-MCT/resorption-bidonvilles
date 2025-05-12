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
        being_funded: false,
        being_funded_at: new Date(),
        type_id: 8,
        type_category: 'association',
        type_name: 'Association',
        type_abbreviation: null,
        user_status: 'active',
    };
}
