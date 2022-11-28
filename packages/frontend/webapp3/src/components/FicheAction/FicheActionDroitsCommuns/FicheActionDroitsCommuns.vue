<template>
    <FicheRubrique title="Droits communs et ressources" id="droits_communs">
        <TableauRb class="my-4" :columns="columns" :data="data" />
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
        { id: "label", label: "Nombre de personnes ayant" },
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
            label: "une domiciliation",
            ...plan.value.states.map((state) => {
                return state.droit_commun.domiciliation === null
                    ? "NC"
                    : state.droit_commun.domiciliation;
            }),
        },
        {
            label: "des droits CAF ouverts",
            ...plan.value.states.map((state) => {
                return state.droit_commun.droits_caf === null
                    ? "NC"
                    : state.droit_commun.droits_caf;
            }),
        },
        {
            label: "un emploi stable / ressources suffisantes",
            ...plan.value.states.map((state) => {
                return state.droit_commun.emploi_stable === null
                    ? "NC"
                    : state.droit_commun.emploi_stable;
            }),
        },
    ];
});
</script>
