<template>
    <IndicateursGrid>
        <IndicateursRow>
            <template v-slot:right>
                <p class="px-4 pb-2">
                    <span class="font-bold"
                        >Résultats pour l'année {{ year }}</span
                    ><br />(à remplir en fin d'année)
                </p>
            </template>
        </IndicateursRow>

        <FormDeclarationActionInputIndicateursPersonnes />

        <template v-if="sections.length > 0">
            <IndicateursRow>
                <template v-slot:left>
                    <p class="mt-4">
                        <span class="font-bold">Nombre ayant eu</span>
                    </p>
                </template>
            </IndicateursRow>

            <template v-for="(section, index) in sections" :key="section.id">
                <IndicateursRow
                    v-if="
                        index > 0 && section.topic !== sections[index - 1].topic
                    "
                >
                    <template v-slot:left>&nbsp;</template>
                </IndicateursRow>

                <component :is="section.component" />
            </template>
        </template>
    </IndicateursGrid>
</template>

<script setup>
import { computed } from "vue";
import { useFormValues } from "vee-validate";

import IndicateursGrid from "@/components/IndicateursGrid/IndicateursGrid.vue";
import IndicateursRow from "@/components/IndicateursTable/IndicateursRow.vue";
import FormDeclarationActionInputIndicateursPersonnes from "./FormDeclarationActionInputIndicateursPersonnes.vue";
import FormDeclarationActionInputIndicateursSante from "./FormDeclarationActionInputIndicateursSante.vue";
import FormDeclarationActionInputIndicateursTravail from "./FormDeclarationActionInputIndicateursTravail.vue";
import FormDeclarationActionInputIndicateursHebergement from "./FormDeclarationActionInputIndicateursHebergement.vue";
import FormDeclarationActionInputIndicateursLogement from "./FormDeclarationActionInputIndicateursLogement.vue";

const values = useFormValues();
const sectionsList = [
    {
        id: "sante",
        topic: "health",
        component: FormDeclarationActionInputIndicateursSante,
    },
    {
        id: "travail",
        topic: "work",
        component: FormDeclarationActionInputIndicateursTravail,
    },
    {
        id: "hebergement",
        topic: "housing",
        component: FormDeclarationActionInputIndicateursHebergement,
    },
    {
        id: "logement",
        topic: "housing",
        component: FormDeclarationActionInputIndicateursLogement,
    },
];
const sections = computed(() => {
    return sectionsList.filter(
        ({ topic }) =>
            values.value.topics && values.value.topics.includes(topic)
    );
});

const year = computed(() => {
    return values.value.date_indicateurs.getFullYear();
});
</script>
