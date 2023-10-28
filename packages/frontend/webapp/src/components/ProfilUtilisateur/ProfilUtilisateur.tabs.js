import FormInformationsPersonnelles from "./FormInformationsPersonnelles/FormInformationsPersonnelles.vue";
import FormIdentifiants from "./FormIdentifiants/FormIdentifiants.vue";
import FormSujets from "./FormSujets/FormSujets.vue";
import FormAbonnements from "./FormAbonnements/FormAbonnements.vue";
import FormDesactiverCompte from "./FormDesactiverCompte/FormDesactiverCompte.vue";

export default [
    {
        id: "informations-personnelles",
        label: "Informations personnelles",
        selfOnly: false,
        component: FormInformationsPersonnelles,
    },
    {
        id: "identifiants",
        label: "Identifiants de connexion",
        selfOnly: true,
        component: FormIdentifiants,
    },
    {
        id: "sujets-interets",
        label: "Sujets d'intérêts",
        component: FormSujets,
    },
    {
        id: "abonnements",
        label: "Courriels automatiques",
        selfOnly: false,
        component: FormAbonnements,
    },
    {
        id: "desactiver-compte",
        label: "Désactiver",
        selfOnly: true,
        component: FormDesactiverCompte,
        icon: "trash-alt",
        variant: "red",
    },
];
