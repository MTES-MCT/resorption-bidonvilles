<template>
    <section class="flex space-x-3">
        <Button
            variant="primaryOutline"
            :icon="parametresIcon"
            iconPosition="left"
            @click="toggleParametres"
            >{{ parametresWording }}</Button
        >
        <Button
            variant="primaryOutline"
            icon="file-excel"
            iconPosition="left"
            disabled
            >Exporter</Button
        >
    </section>
</template>

<script setup>
import { Button } from "@resorptionbidonvilles/ui";
import { useMetricsStore } from "@/stores/metrics.store";
import { computed } from "vue";

const metricsStore = useMetricsStore();
const parametresIcon = computed(() => {
    return metricsStore.showParametres ? "filter-circle-xmark" : "filter";
});
const parametresWording = computed(() => {
    return metricsStore.showParametres
        ? "Masquer les paramètres"
        : "Voir les paramètres";
});

function toggleParametres() {
    metricsStore.showParametres = !metricsStore.showParametres;
}
</script>
