<template>
    <div>
        <DsfrSegmentedSet
            :small="true"
            :options="[
                {
                    label: 'Les 2 années écoulées',
                    value: '2-annees-ecoulees',
                    icon: 'fr-icon-bar-chart-box-line',
                },
                {
                    label: 'L\'année écoulée',
                    value: 'annee-ecoulee',
                    icon: 'fr-icon-bar-chart-box-line',
                },
                {
                    label: 'Le mois passé',
                    value: 'mois-passe',
                    icon: 'fr-icon-bar-chart-box-line',
                },
                {
                    label: 'Les 7 derniers jours',
                    value: '7-derniers-jours',
                    icon: 'fr-icon-bar-chart-box-line',
                },
                {
                    label: 'Période personnalisée',
                    value: 'periode-personnalisee',
                    icon: 'fr-icon-calendar-event-line',
                },
                {
                    label: 'Situation à date',
                    value: 'situation-a-date',
                    icon: 'fr-icon-table-line',
                },
            ]"
            v-model="selectedOption"
            name="synthese-timelaps"
        />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

import updateDataRange from "../../utils/updateDataRange";

const selectedOption = ref("2-annees-ecoulees");
const emit = defineEmits(["update:modelValue"]);

watch(selectedOption, (value) => {
    const optionsNoTrigger = ["periode-personnalisee"];
    if (!optionsNoTrigger.includes(value)) {
        updateDataRange(value);
    }
    emit("update:modelValue", value);
});
</script>
