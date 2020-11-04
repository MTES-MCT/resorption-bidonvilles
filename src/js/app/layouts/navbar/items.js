export default {
    anonymous: [
        { label: "Connexion", target: "/connexion" },
        { label: "Demander un accès", target: "/contact" },
        {
            label: "Aide",
            items: [
                { label: "Nous contacter", target: "/feedback" },
                { label: "Mentions légales", target: "/mentions-legales" },
                { label: "CGUs", target: "/conditions-d-utilisation" }
            ]
        }
    ],
    loading: [
        {
            label: "Aide",
            items: [
                { label: "Nous contacter", target: "/feedback" },
                { label: "Mentions légales", target: "/mentions-legales" },
                { label: "CGUs", target: "/conditions-d-utilisation" }
            ]
        },
        { label: "Déconnexion", target: "/deconnexion" }
    ],
    loaded: [
        {
            label: "Covid-19",
            target: "/covid-19",
            classes: {
                "router-link--covid": true
            }
        },
        {
            label: "Sites",
            items: [
                {
                    label: "Liste des sites",
                    target: "/liste-des-sites",
                    group: "townList"
                },
                {
                    label: "Déclarer un site",
                    target: "/nouveau-site",
                    group: "townCreation"
                }
            ]
        },
        {
            label: "Dispositifs",
            items: [
                {
                    label: "Liste des dispositifs",
                    target: "/liste-des-dispositifs"
                },
                {
                    label: "Déclarer un dispositif",
                    target: "/nouveau-dispositif"
                }
            ]
        },
        {
            label: "Annuaire",
            target: "/annuaire",
            group: "directory"
        },
        {
            label: "Administration",
            items: [
                {
                    label: "Liste des utilisateurs",
                    target: "/liste-des-utilisateurs",
                    group: "users"
                },
                {
                    label: "Créer un utilisateur",
                    target: "/nouvel-utilisateur",
                    group: "userCreation"
                },
                {
                    label: "Statistiques",
                    target: "/statistiques",
                    group: "stats"
                },
                {
                    label: "Historique des activités",
                    target: "/historique-des-activites",
                    group: "admin"
                }
            ]
        },
        {
            label: "Mon compte",
            items: [
                {
                    label: "Gérer mon compte",
                    target: "/mon-compte",
                    group: "me"
                },
                { label: "Déconnexion", target: "/deconnexion" }
            ]
        },
        {
            label: "Aide",
            items: [
                { label: "Nous contacter", target: "/feedback" },
                { label: "Mentions légales", target: "/mentions-legales" },
                { label: "CGUs", target: "/conditions-d-utilisation" }
            ]
        }
    ]
};
