import { useUserStore } from "@/stores/user.store";

export default [
    {
        id: "caracteristiques",
        label: () => "Intervention",
        route: "#caracteristiques",
    },
    {
        id: "localisation",
        label: () => "Lieu",
        route: "#localisation",
    },
    {
        id: "contacts",
        label: () => "Contacts",
        route: "#contacts",
    },
    {
        id: "indicateurs",
        label: () => "Indicateurs",
        route: "#indicateurs",
    },
    {
        id: "journal_de_l_action",
        label: (action) => {
            const total = action.comments.length;
            return `Journal de l'action (${total} message${
                total > 1 ? "s" : ""
            })`;
        },
        route: "#journal_de_l_action",
        icon: "comment",
        variant: "tertiary",
        condition(action) {
            const userStore = useUserStore();
            return userStore.hasActionPermission("action_comment.read", action);
        },
    },
];
