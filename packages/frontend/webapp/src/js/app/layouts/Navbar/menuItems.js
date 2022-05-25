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
            id: "tableau-de-bord",
            menu: "lower"
        },
        {
            label: "Covid-19",
            target: "/covid-19",
            id: "covid",
            classes: "covid",
            color: "text-red600",
            menu: "lower"
        },
        {
            label: "Sites",
            target: "/liste-des-sites",
            id: "sites",
            menu: "lower"
        },
        {
            label: "Actions",
            target: "/liste-des-actions",
            id: "actions",
            menu: "lower"
        },
        {
            label: "Communauté",
            target: "/annuaire",
            id: "annuaire",
            menu: "lower"
        },
        {
            label: "Carte",
            target: "/cartographie",
            id: "carte",
            menu: "lower"
        },
        {
            label: "Dernières activités",
            target: "/activites",
            id: "activites",
            menu: "lower"
        },
        {
            label: "Statistiques",
            target: "/statistiques",
            id: "statistiques",
            menu: "lower"
        },
        {
            label: "Administration",
            target: "/liste-des-utilisateurs",
            id: "administration",
            menu: "lower"
        },
        {
            label: "Blog",
            target: "https://blog-resorption-bidonvilles.fr",
            menu: "upper",
            matomo: {
                category: "Blog",
                action: "Clic sur le lien"
            }
        },
        {
            label: "Mon compte",
            target: "/mon-compte",
            menu: "upper",
            id: "mon-compte"
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
