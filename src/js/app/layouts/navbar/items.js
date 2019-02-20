export default {
    anonymous: [
        { label: 'Connexion', target: '/connexion' },
        { label: 'Demander un accès', target: '/demande-d-acces' },
        { label: 'Signaler un bug', target: '/feedback' },
    ],
    loading: [
        { label: 'Signaler un bug', target: '/feedback' },
        { label: 'Déconnexion', target: '/deconnexion' },
    ],
    loaded: [
        { label: 'Liste des sites', target: '/liste-des-sites', group: 'townList' },
        { label: 'Déclarer un site', target: '/nouveau-site', group: 'townCreation' },
        { label: 'Signaler un bug', target: '/feedback' },
        { label: 'Déconnexion', target: '/deconnexion' },
    ],
};
