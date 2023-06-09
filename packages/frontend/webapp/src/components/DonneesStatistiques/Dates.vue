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
        <Button @click="update" class="h-9">Valider</Button>
    </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";

import { Button, DatepickerInput } from "@resorptionbidonvilles/ui";

const metricsStore = useMetricsStore();

const today = ref(new Date());
const from = ref(new Date());
const to = ref(new Date());

from.value.setDate(from.value.getDate() - 8);
to.value.setDate(to.value.getDate() - 1);

onMounted(() => {
    metricsStore.load(from.value, to.value);
});

function update() {
    metricsStore.load(from.value, to.value);
}
</script>
