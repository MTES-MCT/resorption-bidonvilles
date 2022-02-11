const primaryClass = "text-display-xs font-normal no-underline py-5 px-3";
const emphasedClass = "text-display-xs no-underline py-5 px-3";
const covidClass = "text-red700 font-bold uppercase px-4";

export default {
    anonymous: [
        {
            label: "Connexion",
            target: "/connexion",
            classes: primaryClass,
            menu: "primary"
        },
        {
            label: "Demander un accès",
            target: "/contact",
            classes: primaryClass,
            menu: "primary"
        },
        {
            label: "Aide",
            target: "/conditions-d-utilisation",
            classes: emphasedClass,
            menu: "emphased"
        }
    ],
    loading: [
        {
            label: "Aide",
            target: "/conditions-d-utilisation",
            classes: emphasedClass,
            menu: "emphased"
        },
        {
            label: "Déconnexion",
            target: "/deconnexion",
            classes: emphasedClass,
            menu: "emphased"
        }
    ],
    loaded: [
        {
            label: "Covid-19",
            target: "/covid-19",
            classes: covidClass,
            menu: "primary"
        },
        {
            label: "Sites",
            target: "/liste-des-sites",
            group: "townList",
            classes: primaryClass,
            menu: "primary"
        },
        {
            label: "Dispositifs",
            target: "/liste-des-dispositifs",
            classes: primaryClass,
            menu: "primary"
        },
        {
            label: "Annuaire",
            target: "/annuaire",
            group: "directory",
            classes: primaryClass,
            menu: "primary"
        },
        {
            label: "Statistiques",
            target: "/statistiques",
            group: "stats",
            classes: primaryClass,
            menu: "primary"
        },
        {
            label: "Mon compte",
            target: "/mon-compte",
            group: "me",
            classes: emphasedClass,
            menu: "emphased"
        },
        // {
        //     label: "Déconnexion",
        //     target: "/deconnexion",
        //     classes: emphasedClass,
        //     menu: "emphased"
        // },
        {
            label: "Aide",
            target: "/mentions-legales",
            classes: emphasedClass,
            menu: "emphased"
        }
    ]
};
