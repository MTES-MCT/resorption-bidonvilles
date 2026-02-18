import { Departement } from '#root/types/resources/Departement.d';
import { Region } from '#root/types/resources/Region.d';

const territories = {
    departement(): Departement[] {
        return [
            { code: '01', name: 'Ain', region: '84' },
            { code: '02', name: 'Aisne', region: '32' },
        ];
    },
    region(): Region[] {
        return [{ code: '01', name: 'Guadeloupe' },
            { code: '02', name: 'Martinique' },
        ];
    },
};

export default territories;
