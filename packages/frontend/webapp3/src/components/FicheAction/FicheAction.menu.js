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
        id: "financements",
        label: () => "Financements",
        route: "#financements",
        condition(plan) {
            const userStore = useUserStore();
            return userStore.hasLocalizedPermission(
                "plan_finances.access",
                plan
            );
        },
    },
    {
        id: "equipe",
        label: () => "Équipe",
        route: "#equipe",
        condition(plan) {
            return plan.states.length > 0;
        },
    },
    {
        id: "public",
        label: () => "Public",
        route: "#public",
        condition(plan) {
            return plan.states.length > 0;
        },
    },
    {
        id: "droits_communs",
        label: () => "Droits communs et ressources",
        route: "#droits_communs",
        condition(plan) {
            return plan.states.length > 0;
        },
    },
    {
        id: "sante",
        label: () => "Santé",
        route: "#sante",
        condition(plan) {
            return (
                plan.states.length > 0 &&
                plan.topics.map(({ uid }) => uid).includes("health")
            );
        },
    },
    {
        id: "education",
        label: () => "Éducation et scolarisation",
        route: "#education",
        condition(plan) {
            return (
                plan.states.length > 0 &&
                plan.topics.map(({ uid }) => uid).includes("school")
            );
        },
    },
    {
        id: "emploi",
        label: () => "Formation et emploi",
        route: "#emploi",
        condition(plan) {
            return (
                plan.states.length > 0 &&
                plan.topics.map(({ uid }) => uid).includes("work")
            );
        },
    },
    {
        id: "logement",
        label: () => "Logement",
        route: "#logement",
        condition(plan) {
            return (
                plan.states.length > 0 &&
                plan.topics.map(({ uid }) => uid).includes("housing")
            );
        },
    },
    {
        id: "securisation",
        label: () => "Stabilisation et sécurisation du site",
        route: "#securisation",
        condition(plan) {
            return (
                plan.states.length > 0 &&
                plan.topics.map(({ uid }) => uid).includes("safety")
            );
        },
    },
    {
        id: "indicateurs",
        label: () => "Indicateurs de suivi",
        route: "#indicateurs",
        condition(plan) {
            return plan.states.length === 0;
        },
    },
    {
        id: "journal_de_l_action",
        label: (plan) => {
            const total = plan.comments.length;
            return `Journal de l'action (${total} message${
                total > 1 ? "s" : ""
            })`;
        },
        route: "#journal_de_l_action",
        icon: "comment",
        variant: "tertiary",
        condition(plan) {
            const userStore = useUserStore();
            return userStore.hasLocalizedPermission("plan_comment.list", plan);
        },
    },
];
