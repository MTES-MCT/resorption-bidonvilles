import InputIndicateursSante from "./InputIndicateursSante.vue";
import InputIndicateursTravail from "./InputIndicateursTravail.vue";
import InputIndicateursHebergement from "./InputIndicateursHebergement.vue";
import InputIndicateursLogement from "./InputIndicateursLogement.vue";
import InputIndicateursScolaires from "./InputIndicateursScolaires.vue";

export default [
    {
        id: "sante",
        topic: "health",
        component: InputIndicateursSante,
        inputs: [{ id: "sante_nombre_personnes", tableLabel: "Personnes" }],
    },
    {
        id: "travail",
        topic: "work",
        component: InputIndicateursTravail,
        inputs: [
            { id: "travail_nombre_personnes", tableLabel: "Personnes" },
            { id: "travail_nombre_femmes", tableLabel: "Femmes" },
        ],
    },
    {
        id: "hebergement",
        topic: "housing",
        component: InputIndicateursHebergement,
        inputs: [
            {
                id: "hebergement_nombre_personnes",
                tableLabel: "Personnes",
            },
            {
                id: "hebergement_nombre_menages",
                tableLabel: "Ménages",
            },
        ],
    },
    {
        id: "logement",
        topic: "housing",
        component: InputIndicateursLogement,
        inputs: [
            {
                id: "logement_nombre_personnes",
                tableLabel: "Personnes",
            },
            {
                id: "logement_nombre_menages",
                tableLabel: "Ménages",
            },
        ],
    },
    {
        id: "ecole",
        topic: "school",
        component: InputIndicateursScolaires,
        inputs: {
            // les labels pour la scolarisation sont dans des composants dédiés
            // @see ./InputIndicateursScolaires.vue
            scolarisables: [{ id: "scolaire_mineurs_trois_ans_et_plus" }],
            mediation: [{ id: "scolaire_mineurs_en_mediation" }],
            maternelle: [{ id: "scolaire_nombre_maternelle" }],
            elementaire: [{ id: "scolaire_nombre_elementaire" }],
            college: [{ id: "scolaire_nombre_college" }],
            lycee: [{ id: "scolaire_nombre_lycee" }],
            autre: [{ id: "scolaire_nombre_autre" }],
        },
    },
];
