<template>
    <FicheRubrique title="Logement" id="logement">
        <div
            class="mt-4"
            v-for="(field, index) in housingFields"
            :key="field.name"
        >
            <p class="font-bold" :class="{ 'mt-4': index > 0 }">
                {{ field.label }}
            </p>
            <TableauRb :columns="columns" :data="data[field.name]" />
        </div>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";
import housingFields from "./FicheActionLogement.housingFields";

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
    return housingFields.reduce((acc, { name }) => {
        return {
            ...acc,
            [name]: [
                {
                    label: "Nombre de personnes",
                    ...getEntry(name, "people"),
                },
                {
                    label: "Nombre de ménages",
                    ...getEntry(name, "families"),
                },
            ],
        };
    }, {});
});

function getEntry(field, entry) {
    return plan.value.states.map((state) => {
        return state.logement[field][entry] === null
            ? "NC"
            : state.logement[field][entry];
    });
}
</script>
