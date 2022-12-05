<template>
    <FicheRubrique title="Formation et emploi" id="emploi">
        <p class="font-bold mt-4">
            Nombre de personnes inscrites ou suivies par...
        </p>
        <TableauRb :columns="columns" :data="data1" />
        <p class="font-bold mt-4">Nombre de personnes ayant...</p>
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
            label: "Pôle emploi",
            ...getEntry("pole_emploi"),
        },
        {
            label: "(dont femmes)",
            ...getEntry("pole_emploi_femmes"),
        },
        {
            label: "Mission locale",
            ...getEntry("mission_locale"),
        },
        {
            label: "(dont femmes)",
            ...getEntry("mission_locale_femmes"),
        },
    ];
});
const data2 = computed(() => {
    return [
        {
            label: "Un contrat",
            ...getEntry("contrats"),
        },
        {
            label: "(dont femmes)",
            ...getEntry("contrats_femmes"),
        },
        {
            label: "Une formation",
            ...getEntry("formations"),
        },
        {
            label: "(dont femmes)",
            ...getEntry("formations_femmes"),
        },
        {
            label: "Un statut autoentrepreneur",
            ...getEntry("autoentrepreneurs"),
        },
        {
            label: "(dont femmes)",
            ...getEntry("autoentrepreneurs_femmes"),
        },
        {
            label: "l'ARE",
            ...getEntry("are"),
        },
        {
            label: "(dont femmes)",
            ...getEntry("are_femmes"),
        },
    ];
});
function getEntry(entry) {
    return plan.value.states.map((state) => {
        return state.formation[entry] === null ? "NC" : state.formation[entry];
    });
}
</script>
