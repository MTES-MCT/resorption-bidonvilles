import svgSearch from "@/assets/img/dsfr/search.svg";
import svgUpdate from "@/assets/img/dsfr/update.svg";
import svgAction from "@/assets/img/dsfr/human-cooperation.svg";
import svgCommunity from "@/assets/img/dsfr/community.svg";
import svgListSites from "@/assets/img/dsfr/location-france.svg";
import svgSiteAdd from "@/assets/img/dsfr/site-add.svg";
import svgAllActions from "@/assets/img/dsfr/all-actions.svg";

export default [
    {
        name: "Sites",
        icon: "tent",
        permission: "shantytown.read",
        actions: [
            {
                label: "Mettre à jour un site",
                description:
                    "J'ai constaté des changements sur un site ou je signale mon passage.",
                icon: svgUpdate,
                clickMgmt: "sites",
                placeHolder: "Adresse, nom d'un site, ville, code postal...",
                permission: "shantytown.read",
                to: "/liste-des-sites",
                mainAction: true,
            },
            {
                label: "Afficher les sites",
                description: "Je veux voir tous les sites de mon territoire.",
                icon: svgListSites,
                to: "/liste-des-sites",
                permission: "shantytown.read",
            },
            {
                label: "Déclarer un site",
                description: "Je veux créer un nouveau site.",
                icon: svgSiteAdd,
                to: "/site/nouveau",
                permission: "shantytown.create",
            },
        ],
    },
    {
        name: "Actions",
        icon: "handshake-angle",
        permission: "action.read",
        actions: [
            {
                label: "Rechercher une action",
                description:
                    "Je veux rechercher une action sur mon territoire.",
                icon: svgSearch,
                clickMgmt: "actions",
                placeHolder: "Nom d'une action, commune, département, acteur.",
                permission: "action.read",
                to: "/liste-des-actions",
                mainAction: true,
            },
            {
                label: "Voir toutes les actions",
                description:
                    "Je veux accéder à toutes les actions sur mon territoire.",
                icon: svgAllActions,
                to: "/liste-des-actions",
                permission: "action.read",
            },
            {
                label: "Saisir une action",
                description: "Je veux renseigner une action.",
                icon: svgAction,
                to: "/action/nouveau",
                permission: "action.create",
            },
        ],
    },
    {
        name: "Annuaire",
        icon: "users",
        permission: null,
        options: { half: true },
        actions: [
            {
                label: "Rechercher une personne ou une structure",
                description:
                    "Je recherche une personne ou une structure en particulier.",
                icon: svgSearch,
                to: "/annuaire",
                permission: null,
            },
        ],
    },
    {
        name: "Entraide",
        icon: "comments",
        permission: null,
        options: { half: true },
        actions: [
            {
                label: "J'ai besoin d'aide",
                description: "Je veux poser une question à la communauté.",
                icon: svgCommunity,
                to: "/communaute/nouvelle-question",
                permission: null,
            },
        ],
    },
];
