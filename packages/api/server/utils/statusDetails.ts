export type ShantytownStatus = 'resorbed' | 'closed_by_justice' | 'closed_by_pref_admin' | 'closed_by_city_admin' | 'other' | 'unknown' | 'open';

const statusDetails: Record<ShantytownStatus, string> = {
    resorbed: 'Résorption progressive du site',
    closed_by_justice: 'Décision de justice suite à une plainte du propriétaire',
    closed_by_pref_admin: 'Décision administrative de la Préfecture',
    closed_by_city_admin: 'Décision administrative de la Commune',
    other: 'Autre',
    unknown: 'Raison inconnue',
    open: 'Ouvert',
};

export default statusDetails;
