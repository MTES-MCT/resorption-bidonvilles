<template>
    <FicheRubrique
        title="Stabilisation et sécurisation du site"
        id="securisation"
    >
        <TableauRb class="mt-4" :columns="columns" :data="data" />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import TableauRb from "@/components/Tableau/TableauRb.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const columns = computed(() => {
    return [
        { id: "label", label: "" },
        ...plan.value.states.map((state, index) => {
            return {
                id: index,
                label: formatDate(
                    new Date(state.date).getTime() / 1000,
                    "d B y"
                ),
            };
        }),
    ];
});
const data = computed(() => {
    return [
        {
            label: "Nombre d'accès réguliers à l'eau potable",
            ...getEntry("points_eau"),
        },
        {
            label: "Nombre de sanitaires",
            ...getEntry("wc"),
        },
        {
            label: "Nombre d'accès réguliers à l'électricité",
            ...getEntry("electricite"),
        },
        {
            label: "Nombre de bennes disponibles pour le ramassage des déchets du site",
            ...getEntry("nombre_bennes"),
        },
    ];
});

function getEntry(entry) {
    return plan.value.states.map((state) => {
        return state.securisation[entry] === null
            ? "NC"
            : state.securisation[entry];
    });
}
</script>
