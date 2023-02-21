import { JusticeReaderRow } from '#server/models/organizationModel/findJusticeReaders';

export default function raw(): JusticeReaderRow {
    return {
        user_id: 2,
        email: 'jean@dupont.fr',
        first_name: 'Jean',
        last_name: 'Dupont',
        phone: '0102030405',
        position: 'Test',
        role_admin: null,
        role_regular: 'collaborator',
        id: 1,
        name: 'Orgnaisation 02',
        abbreviation: 'ORGA2',
        location_type: 'departement',
        being_funded: false,
        being_funded_at: new Date(),
        region_code: '93',
        region_name: "Provence-Alpes-Côte d'Azur",
        departement_code: '13',
        departement_name: 'Bouches-du-Rhône',
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
