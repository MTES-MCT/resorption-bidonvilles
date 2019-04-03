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
        {
            label: 'Gestion des sites',
            items: [
                { label: 'Liste des sites', target: '/liste-des-sites', group: 'townList' },
                {
                    label: 'Déclarer un site',
                    target: '/nouveau-site',
                    group: 'townCreation',
                },
            ],
        },
        {
            label: 'Gestion des actions',
            items: [
                {
                    label: 'Liste des actions',
                    target: '/liste-des-actions',
                    group: 'actionList',
                },
                {
                    label: 'Déclarer une action',
                    target: '/nouvelle-action',
                    group: 'actionCreation',
                },
            ],
        },
        {
            label: 'Utilisateurs',
            items: [
                {
                    label: 'Gérer les utilisateurs',
                    target: '/liste-des-utilisateurs',
                    group: 'users',
                },
                {
                    label: 'Créer un utilisateur',
                    target: '/nouvel-utilisateur',
                    group: 'users',
                },
            ],
        },
        {
            label: 'Mon compte',
            items: [
                { label: 'Gérer mon compte', target: '/mon-compte', group: 'me' },
                { label: 'Déconnexion', target: '/deconnexion' },
            ],
        },
        { label: 'Nous contacter', target: '/feedback' },
    ],
};
