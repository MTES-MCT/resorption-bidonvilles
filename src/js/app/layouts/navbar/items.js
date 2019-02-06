export default {
    anonymous: [
        { label: 'Connexion', target: '/connexion' },
        { label: 'Demander un accès', target: '/demande-d-acces' },
    ],
    loading: [
        { label: 'Déconnexion', target: '/deconnexion' },
    ],
    loaded: [
        { label: 'Liste des sites', target: '/liste-des-sites', group: 'townList' },
        { label: 'Déclarer un site', target: '/nouveau-site', group: 'townCreation' },
        { label: 'Déconnexion', target: '/deconnexion' },
    ],
};
