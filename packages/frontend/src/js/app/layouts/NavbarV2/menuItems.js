const upperMenuItemClass =
    "text-display-xs font-normal text-french-blue hover:text-french-blue hover:bg-gray-300 h-8 pt-2 pb-8 rounded-full hover:rounded-full py-5 px-3";
const lowerMenuItemClass = "font-normal hover:bg-gray-300 py-5 px-3";
const covidClass =
    "hover:bg-gray-300 text-red700 font-bold uppercase py-5 px-3";

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
            target: "/conditions-d-utilisation",
            classes: upperMenuItemClass,
            menu: "upper"
        }
    ],
    loading: [
        {
            label: "Aide",
            target: "/conditions-d-utilisation",
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
            label: "Carte",
            target: "/cartographie",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Sites",
            target: "/liste-des-sites",
            group: "townList",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Actions",
            target: "/liste-des-dispositifs",
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
            group: "stats",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Annuaire",
            target: "/annuaire",
            group: "directory",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Administration",
            target: "/liste-des-utilisateurs",
            group: "directory",
            classes: lowerMenuItemClass,
            menu: "lower"
        },
        {
            label: "Mon compte",
            target: "/mon-compte",
            group: "me",
            classes: upperMenuItemClass,
            menu: "upper"
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
