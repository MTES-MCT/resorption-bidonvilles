import { useEventBus } from "@common/helpers/event-bus";
import { useUserStore } from "@/stores/user.store";

export default [
    {
        id: "caracteristiques",
        label: () => "Caractéristiques du site",
        route: "#caracteristiques",
    },
    {
        id: "fermeture",
        label: () => "Fermeture du site",
        route: "#fermeture",
        condition(town) {
            return town.closedAt !== null;
        },
    },
    {
        id: "actions",
        label: () => "Actions",
        route: "#actions",
        condition(town) {
            return town.actions.length > 0;
        },
    },
    {
        id: "habitants",
        label: () => "Habitants",
        route: "#habitants",
    },
    {
        id: "conditions_de_vie",
        label: () => "Conditions de vie et environnement",
        route: "#conditions_de_vie",
    },
    {
        id: "procedure",
        label: () => "Procédure",
        route: "#procedure",
        condition() {
            const userStore = useUserStore();
            return userStore.hasJusticePermission === true;
        },
    },
    {
        id: "intervenants",
        label: () => "Intervenants",
        route: "#intervenants",
    },
    {
        id: "journal_du_site",
        label: (town) => {
            const total = town.comments.length;
            return `Journal du site (${total} message${total > 1 ? "s" : ""})`;
        },
        route: "#journal_du_site",
        icon: "comment",
        variant: "secondary",
        condition(town) {
            const userStore = useUserStore();
            return userStore.hasLocalizedPermission(
                "shantytown_comment.list",
                town
            );
        },
    },
    {
        id: "historique",
        label: () => "Voir l'historique des modifications",
        icon: "history",
        variant: "primary",
        action() {
            const { emit } = useEventBus();
            emit("fichesite:openHistorique");
        },
    },
];
