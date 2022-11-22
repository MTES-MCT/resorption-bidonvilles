export default [
    {
        id: "caracteristiques",
        label: "Intervention",
        route: "#caracteristiques",
    },
    {
        id: "localisation",
        label: "Lieu",
        route: "#localisation",
    },
    {
        id: "contacts",
        label: "Contacts",
        route: "#contacts",
    },
    {
        id: "financements",
        label: "Financements",
        route: "#financements",
    },
    {
        id: "equipe",
        label: "Équipe",
        route: "#equipe",
        condition(plan) {
            return plan.states.length > 0;
        },
    },
    {
        id: "public",
        label: "Public",
        route: "#public",
        condition(plan) {
            return plan.states.length > 0;
        },
    },
    {
        id: "droits_communs",
        label: "Droits communs et ressources",
        route: "#droits_communs",
        condition(plan) {
            return plan.states.length > 0;
        },
    },
    {
        id: "sante",
        label: "Santé",
        route: "#sante",
        condition(plan) {
            return plan.topics.map(({ uid }) => uid).includes("health");
        },
    },
    {
        id: "education",
        label: "Éducation et scolarisation",
        route: "#education",
        condition(plan) {
            return plan.topics.map(({ uid }) => uid).includes("school");
        },
    },
    {
        id: "emploi",
        label: "Formation et emploi",
        route: "#emploi",
        condition(plan) {
            return plan.topics.map(({ uid }) => uid).includes("work");
        },
    },
    {
        id: "logement",
        label: "Logement",
        route: "#logement",
        condition(plan) {
            return plan.topics.map(({ uid }) => uid).includes("housing");
        },
    },
    {
        id: "securisation",
        label: "Stabilisation et sécurisation du site",
        route: "#securisation",
        condition(plan) {
            return plan.topics.map(({ uid }) => uid).includes("safety");
        },
    },
    {
        id: "journal_de_l_action",
        label: "Journal de l'action",
        route: "#journal_de_l_action",
        icon: "comment",
        variant: "tertiary",
    },
];
