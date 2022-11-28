<template>
    <FicheRubrique title="Santé" id="sante">
        <p class="font-bold mt-4">Nombre de personnes avec...</p>
        <TableauRb :columns="columns" :data="data1" />

        <p class="font-bold mt-4">
            Nombre de personnes ayant fait l'objet d'au moins...
        </p>
        <TableauRb :columns="columns" :data="data2" />
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
const data1 = computed(() => {
    return [
        {
            label: "une couverture AME valide",
            ...getEntry("ame_valide"),
        },
        {
            label: "une couverture PUMA valide",
            ...getEntry("puma_valide"),
        },
        {
            label: "une demande AME en cours",
            ...getEntry("ame_en_cours"),
        },
        {
            label: "une demande PUMA en cours",
            ...getEntry("puma_en_cours"),
        },
    ];
});
const data2 = computed(() => {
    return [
        {
            label: "une orientation vers une structure de santé",
            ...getEntry("orientation"),
        },
        {
            label: "un accompagnement physique vers une structure de santé",
            ...getEntry("accompagnement"),
        },
    ];
});

function getEntry(entry) {
    return plan.value.states.map((state) => {
        return state.sante[entry] === null ? "NC" : state.sante[entry];
    });
}
</script>
