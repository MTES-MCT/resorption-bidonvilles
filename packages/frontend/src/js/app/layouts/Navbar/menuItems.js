const upperMenuItemClass =
    "text-display-xs font-normal text-primary hover:bg-gray-300 h-8 pt-2 pb-8 rounded-full hover:rounded-full py-5 px-3";
const lowerMenuItemClass = "font-normal hover:bg-gray-300 -mb-1 py-2 px-3";
const covidClass =
    "hover:bg-gray-300 text-red700 font-bold uppercase -mb-1 p-2";

export default {
    anonymous: [
        {
            label: "Connexion",
            target: "/connexion",
            classes: upperMenuItemClass,
            menu: "upper"
        },
        {
            label: "Demander un accès",
            target: "/contact",
            classes: upperMenuItemClass,
            menu: "upper"
        },
        {
            label: "Aide",
            target: "/mentions-legales",
            classes: upperMenuItemClass,
            menu: "upper"
        }
    ],
    loading: [
        {
            label: "Aide",
            target: "/mentions-legales",
            classes: upperMenuItemClass,
            menu: "upper"
        },
        {
            label: "Déconnexion",
            target: "/deconnexion",
            classes: upperMenuItemClass,
            menu: "upper"
        }
    ],
    loaded: [
        {
            label: "Accueil",
            target: "/",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Covid-19",
            target: "/covid-19",
            classes: covidClass,
            menu: "lower"
        },
        {
            label: "Sites",
            target: "/liste-des-sites",
            classes: lowerMenuItemClass,
            menu: "lower",
            group: "townList"
        },
        {
            label: "Actions",
            target: "/liste-des-dispositifs",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Annuaire",
            target: "/annuaire",
            classes: lowerMenuItemClass,
            menu: "lower",
            group: "directory"
        },
        {
            label: "Carte",
            target: "/cartographie",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Dernières activités",
            target: "/activites",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Statistiques",
            target: "/statistiques",
            classes: lowerMenuItemClass,
            menu: "lower",
            group: "stats"
        },
        {
            label: "Administration",
            target: "/liste-des-utilisateurs",
            classes: lowerMenuItemClass,
            menu: "lower",
            group: "users"
        },
        {
            label: "Mon compte",
            target: "/mon-compte",
            classes: upperMenuItemClass,
            menu: "upper",
            group: "me"
        },
        {
            label: "Aide",
            target: "/mentions-legales",
            classes: upperMenuItemClass,
            menu: "upper"
        },
        {
            label: "Déconnexion",
            target: "/deconnexion",
            classes: upperMenuItemClass,
            menu: "upper"
        }
    ]
};
