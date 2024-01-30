<template>
    <section class="flex space-x-3 items-end">
        <DatepickerInput name="from" :maxDate="to" label="Du" withoutMargin />
        <DatepickerInput
            name="to"
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
import { useForm } from "vee-validate";
import { useMetricsStore } from "@/stores/metrics.store";
import { trackEvent } from "@/helpers/matomo";
import { Button, DatepickerInput } from "@resorptionbidonvilles/ui";
import { toRef } from "vue";

const metricsStore = useMetricsStore();

const today = ref(new Date());

const { values } = useForm({
    initialValues: {
        from: metricsStore.from,
        to: metricsStore.to,
    },
});
const from = toRef(values, "from");
const to = toRef(values, "to");

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
    trackEvent(
        "Visualisation des données nationales",
        "Changement dates",
        `${from.value.toLocaleDateString()} - ${to.value.toLocaleDateString()}`
    );
    metricsStore.from = from.value;
    metricsStore.to = to.value;
    metricsStore.load();
}
</script>
