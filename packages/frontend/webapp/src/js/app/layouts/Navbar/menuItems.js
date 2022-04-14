export default {
    anonymous: [
        {
            label: "Connexion",
            target: "/connexion",
            menu: "upper"
        },
        {
            label: "Demander un accès",
            target: "/contact",
            menu: "upper"
        },
        {
            label: "Aide",
            target: "/mentions-legales",
            menu: "upper"
        }
    ],
    loading: [
        {
            label: "Aide",
            target: "/mentions-legales",
            menu: "upper"
        },
        {
            label: "Déconnexion",
            target: "/deconnexion",
            menu: "upper"
        }
    ],
    loaded: [
        {
            label: "Accueil",
            target: "/",
            menu: "lower"
        },
        {
            label: "Covid-19",
            target: "/covid-19",
            classes: "font-bold uppercase",
            color: "text-red600",
            menu: "lower"
        },
        {
            label: "Sites",
            target: "/liste-des-sites",
            menu: "lower",
            group: "townList"
        },
        {
            label: "Actions",
            target: "/liste-des-actions",
            menu: "lower"
        },
        {
            label: "Annuaire",
            target: "/annuaire",
            menu: "lower",
            group: "directory"
        },
        {
            label: "Carte",
            target: "/cartographie",
            menu: "lower"
        },
        {
            label: "Dernières activités",
            target: "/activites",
            menu: "lower"
        },
        {
            label: "Statistiques",
            target: "/statistiques",
            menu: "lower",
            group: "stats"
        },
        {
            label: "Administration",
            target: "/liste-des-utilisateurs",
            menu: "lower",
            group: "users"
        },
        {
            label: "Mon compte",
            target: "/mon-compte",
            menu: "upper",
            group: "me"
        },
        {
            label: "Aide",
            target: "/mentions-legales",
            menu: "upper"
        },
        {
            label: "Déconnexion",
            target: "/deconnexion",
            menu: "upper"
        }
    ]
};
