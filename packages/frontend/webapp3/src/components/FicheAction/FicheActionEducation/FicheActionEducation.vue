<template>
    <FicheRubrique title="Éducation et scolarisation">
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
            label: "Mineurs en âge d'être scolarisés ou de suivre une formation",
            ...getEntry("scolarisables"),
        },
        {
            label: "Mineurs bénéficiant d'une action de médiation (3 - 18 ans)",
            ...getEntry("en_mediation"),
        },
        {
            label: "Scolarisés en maternelle",
            ...getEntry("maternelles"),
        },
        {
            label: "Scolarisés en élémentaire",
            ...getEntry("elementaires"),
        },
        {
            label: "Scolarisés en collège",
            ...getEntry("colleges"),
        },
        {
            label: "Scolarisés au Lycée - formation professionnelle",
            ...getEntry("lycees"),
        },
    ];
});

function getEntry(entry) {
    return plan.value.states.map((state) => {
        return state.education[entry] === null ? "NC" : state.education[entry];
    });
}
</script>
