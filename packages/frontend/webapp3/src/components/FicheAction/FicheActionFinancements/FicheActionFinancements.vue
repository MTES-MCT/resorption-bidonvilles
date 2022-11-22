<template>
    <FicheRubrique title="Financements">
        <div class="flex justify-between mb-2">
            <Button
                icon="chevron-left"
                iconPosition="left"
                variant="custom"
                size="custom"
                class="hover:bg-G200 rounded-full px-4 py-1 focus:outline-none"
                @click="previousYear"
                type="button"
                :disabled="currentYear === minYear"
                >Année précédente</Button
            >
            <div class="font-bold text-lg">Financements {{ currentYear }}</div>
            <Button
                icon="chevron-right"
                iconPosition="right"
                variant="custom"
                size="custom"
                class="hover:bg-G200 rounded-full px-4 py-1 focus:outline-none"
                @click="nextYear"
                type="button"
                :disabled="currentYear === maxYear"
                >Année suivante</Button
            >
        </div>

        <TableauRb :columns="columns" :data="currentYearData">
            <template v-slot:cell="{ column, content }">
                <span v-if="column === 'type'">{{ content.name }}</span>
                <span v-else-if="column === 'amount'"
                    >{{ content }} &euro;<br /><span class="text-gray-500"
                        >soit {{ Math.round((content / total) * 100) }}%</span
                    ></span
                >
                <span v-else-if="column === 'details'">{{ content }}</span>
                <span v-else-if="column === 'realAmount'">
                    <span v-if="content !== null">{{ content }} &euro;</span>
                    <span v-else>N/R</span>
                </span>
            </template>
        </TableauRb>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import columns from "./FicheActionFinancements.columns";

import { Button } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import TableauRb from "@/components/Tableau/TableauRb.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const maxYear = ref(new Date().getFullYear());

const minYear = ref(
    Math.min(
        ...plan.value.finances
            .filter(({ data }) => {
                return data.length > 0;
            })
            .map(({ year }) => year),
        maxYear.value
    )
);

const currentYear = ref(maxYear.value);

const currentYearData = computed(() => {
    const currentYearTable = plan.value.finances.find(({ year }) => {
        return year === currentYear.value;
    });

    return currentYearTable ? currentYearTable.data : [];
});

const total = computed(() => {
    return currentYearData.value.reduce((sum, { amount }) => sum + amount, 0);
});

function nextYear() {
    currentYear.value = Math.min(maxYear.value, currentYear.value + 1);
}
function previousYear() {
    currentYear.value = Math.max(minYear.value, currentYear.value - 1);
}
</script>
