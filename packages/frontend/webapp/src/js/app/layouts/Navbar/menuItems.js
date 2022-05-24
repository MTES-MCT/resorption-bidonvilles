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
            links: ["/"],
            menu: "lower"
        },
        {
            label: "Covid-19",
            target: "/covid-19",
            links: ["/covid-19"],
            classes: "font-bold uppercase",
            color: "text-red600",
            menu: "lower"
        },
        {
            label: "Sites",
            target: "/liste-des-sites",
            links: ["/liste-des-sites", "/site", "/nouveau-site"],
            menu: "lower",
            group: "townList"
        },
        {
            label: "Actions",
            target: "/liste-des-actions",
            links: [
                "/liste-des-actions",
                "/nouvelle-action",
                "/action",
                "/modifier-action"
            ],
            menu: "lower"
        },
        {
            label: "Annuaire",
            target: "/annuaire",
            links: ["/annuaire"],
            menu: "lower",
            group: "directory"
        },
        {
            label: "Carte",
            target: "/cartographie",
            links: ["/cartographie"],
            menu: "lower"
        },
        {
            label: "Dernières activités",
            target: "/activites",
            links: ["/activites"],
            menu: "lower"
        },
        {
            label: "Statistiques",
            target: "/statistiques",
            links: ["/statistiques"],
            menu: "lower",
            group: "stats"
        },
        {
            label: "Communauté",
            target: "/liste-des-utilisateurs",
            links: [
                "/liste-des-utilisateurs",
                "/nouvel-utilisateur",
                "/utilisateur"
            ],
            menu: "lower",
            group: "users"
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
