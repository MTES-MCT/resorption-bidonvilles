<template>
    <section class="flex space-x-3 items-end">
        <DatepickerInput
            v-model="from"
            :maxDate="to"
            label="Du"
            withoutMargin
        />
        <DatepickerInput
            v-model="to"
            :minDate="from"
            :maxDate="today"
            label="Au"
            withoutMargin
        />
        <Button
            @click="update"
            class="h-9"
            :loading="['init', 'refresh'].includes(metricsStore.nationStatus)"
            v-if="datesAreNotLoaded && from && to"
            >Valider</Button
        >
    </section>
</template>

<script>
export default {
    name: "RbDates",
};
</script>

<script setup>
import { ref, computed } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";

import { Button, DatepickerInput } from "@resorptionbidonvilles/ui";

const metricsStore = useMetricsStore();

const today = ref(new Date());

const from = ref(new Date(metricsStore.from));
const to = ref(new Date(metricsStore.to));

const datesAreNotLoaded = computed(() => {
    if (!metricsStore.loadedDates.from || !metricsStore.loadedDates.to) {
        return true;
    }

    if (!from.value || !to.value) {
        return false;
    }

    return (
        from.value.toISOString().slice(0, 10) !==
            metricsStore.loadedDates.from.toISOString().slice(0, 10) ||
        to.value.toISOString().slice(0, 10) !==
            metricsStore.loadedDates.to.toISOString().slice(0, 10)
    );
});

function update() {
    metricsStore.from = from.value;
    metricsStore.to = to.value;
    metricsStore.load();
}
</script>
