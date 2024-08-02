<template>
    <div>
        <DsfrSegmentedSet
            :small="true"
            :options="[
                {
                    label: 'Les 2 années écoulées',
                    value: '2-annees-ecoulees',
                    icon: 'chart-simple',
                },
                {
                    label: 'L\'année écoulée',
                    value: 'annee-ecoulee',
                    icon: 'chart-simple',
                },
                {
                    label: 'Le mois passé',
                    value: 'mois-passe',
                    icon: 'chart-simple',
                },
                {
                    label: 'Les 7 derniers jours',
                    value: '7-derniers-jours',
                    icon: 'chart-simple',
                },
                {
                    label: 'Période personnalisée',
                    value: 'periode-personnalisee',
                    icon: 'chart-simple',
                },
                {
                    label: 'Situation à date',
                    value: 'situation-a-date',
                    icon: 'table-list',
                },
            ]"
            v-model="selectedOption"
            name="synthese-timelaps"
        />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { DsfrSegmentedSet } from "@resorptionbidonvilles/ui";

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
