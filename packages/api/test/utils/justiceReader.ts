import { JusticeReaderRow } from '#server/models/organizationModel/findJusticeReaders';

export default function raw(): JusticeReaderRow {
    return {
        user_id: 2,
        first_name: 'Jean',
        last_name: 'Dupont',
        id: 1,
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
        type_id: 8,
        type_category: 'association',
        type_name: 'Association',
        type_abbreviation: null,
    };
}
