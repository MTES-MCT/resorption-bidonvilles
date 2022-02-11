export default {
    anonymous: [
        {
            label: "Connexion",
            target: "/connexion",
            menu: "primary"
        },
        {
            label: "Demander un accès",
            target: "/contact",
            menu: "primary"
        },
        {
            label: "Aide",
            target: "/conditions-d-utilisation",
            classes: "text-display-xs no-underline py-5 px-3",
            menu: "emphased"
        }
    ],
    loading: [
        {
            label: "Aide",
            target: "/conditions-d-utilisation",
            classes: "text-display-xs no-underline py-5 px-3",
            menu: "emphased"
        },
        {
            label: "Déconnexion",
            target: "/deconnexion",
            classes: "text-display-xs no-underline py-5 px-3",
            menu: "emphased"
        }
    ],
    loaded: [
        {
            label: "Covid-19",
            target: "/covid-19",
            classes: "text-red-700 font-bold uppercase px-4",
            menu: "primary"
        },
        {
            label: "Sites",
            target: "/liste-des-sites",
            group: "townList",
            classes: "text-display-xs font-normal no-underline py-5 px-3",
            menu: "primary"
        },
        {
            label: "Dispositifs",
            target: "/liste-des-dispositifs",
            classes: "text-display-xs font-normal no-underline py-5 px-3",
            menu: "primary"
        },
        {
            label: "Annuaire",
            target: "/annuaire",
            group: "directory",
            classes: "text-display-xs font-normal no-underline py-5 px-3",
            menu: "primary"
        },
        {
            label: "Statistiques",
            target: "/statistiques",
            group: "stats",
            classes: "text-display-xs font-normal no-underline py-5 px-3",
            menu: "primary"
        },
        {
            label: "Mon compte",
            target: "/mon-compte",
            group: "me",
            classes: "text-display-xs no-underline py-5 px-3",
            menu: "emphased"
        },
        // {
        //     label: "Déconnexion",
        //     target: "/deconnexion",
        //     classes: "text-display-xs no-underline py-5 px-3",
        //     menu: "emphased"
        // },
        {
            label: "Aide",
            target: "/mentions-legales",
            classes: "text-display-xs no-underline py-5 px-3",
            menu: "emphased"
        }
    ]
};
