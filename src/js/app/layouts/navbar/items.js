export default {
    anonymous: [
        { label: 'Connexion', target: '/connexion' },
        { label: 'Demander un accès', target: '/demande-d-acces' },
        {
            label: 'Aide',
            items: [
                { label: 'Nous contacter', target: '/feedback' },
                { label: 'CGUs', target: '/conditions-d-utilisation' },
            ],
        },
    ],
    loading: [
        {
            label: 'Aide',
            items: [
                { label: 'Nous contacter', target: '/feedback' },
                { label: 'CGUs', target: '/conditions-d-utilisation' },
            ],
        },
        { label: 'Déconnexion', target: '/deconnexion' },
    ],
    loaded: [
        {
            label: 'Sites',
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
            label: 'Dispositifs',
            items: [
                { label: 'Liste des dispositifs', target: '/liste-des-dispositifs' },
                { label: 'Déclarer un dispositif', target: '/nouveau-dispositif' },
            ],
        },
        {
            label: 'Acteurs',
            items: [
                {
                    label: 'Gérer les acteurs',
                    target: '/liste-des-operateurs',
                    group: 'operators',
                },
                {
                    label: 'Créer un acteur',
                    target: '/nouvel-operateur',
                    group: 'operatorCreation',
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
                    group: 'userCreation',
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
        {
            label: 'Aide',
            items: [
                { label: 'Nous contacter', target: '/feedback' },
                { label: 'CGUs', target: '/conditions-d-utilisation' },
            ],
        },
    ],
};
