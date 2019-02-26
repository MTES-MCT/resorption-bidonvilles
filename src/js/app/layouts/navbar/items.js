export default {
    anonymous: [
        { label: 'Connexion', target: '/connexion' },
        { label: 'Demander un accès', target: '/demande-d-acces' },
        { label: 'Nous contacter', target: '/feedback' },
    ],
    loading: [
        { label: 'Nous contacter', target: '/feedback' },
        { label: 'Déconnexion', target: '/deconnexion' },
    ],
    loaded: [
        { label: 'Liste des sites', target: '/liste-des-sites', group: 'townList' },
        { label: 'Déclarer un site', target: '/nouveau-site', group: 'townCreation' },
        { label: 'Mon compte', target: '/mon-compte', group: 'me' },
        { label: 'Nous contacter', target: '/feedback' },
        { label: 'Déconnexion', target: '/deconnexion' },
    ],
};
