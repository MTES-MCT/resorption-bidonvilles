<template>
    <section class="flex space-x-3 items-end">
        <DatepickerInput
            name="from"
            :maxDate="to - 1"
            :label="
                departementMetricsStore.activeTab === 'evolution' ? 'De' : 'Du'
            "
            withoutMargin
            :section="departementMetricsStore.activeTab"
            @update:modelValue="(date) => updateDate('from', date)"
        />
        <DatepickerInput
            name="to"
            :minDate="new Date(from).setDate(from.getDate() + 1)"
            :maxDate="today"
            :label="
                departementMetricsStore.activeTab === 'evolution' ? 'À' : 'Au'
            "
            withoutMargin
            :section="departementMetricsStore.activeTab"
            @update:modelValue="(date) => updateDate('to', date)"
        />
        <DsfrButton
            @click="update"
            :loading="['init', 'refresh'].includes(metricsStore.nationStatus)"
            v-if="datesAreNotLoaded && from && to"
            >Valider</DsfrButton
        >
    </section>
</template>

<script>
export default {
    name: "RbDates",
};
</script>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useForm } from "vee-validate";
import { useMetricsStore } from "@/stores/metrics.store";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { trackEvent } from "@/helpers/matomo";
import { Button, DatepickerInput } from "@resorptionbidonvilles/ui";

const metricsStore = useMetricsStore();
const departementMetricsStore = useDepartementMetricsStore();
const today = ref(new Date());

const from = computed(() =>
    departementMetricsStore.activeTab === "evolution"
        ? metricsStore.evolution.from
        : metricsStore.from
);
const to = computed(() =>
    departementMetricsStore.activeTab === "evolution"
        ? metricsStore.evolution.to
        : metricsStore.to
);

const { setFieldValue } = useForm({
    initialValues: {
        from: from.value,
        to: to.value,
    },
});

watchEffect(() => {
    setFieldValue("from", from.value);
    setFieldValue("to", to.value);
});

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

const updateDate = (field, newDate) => {
    if (field === "from") {
        if (departementMetricsStore.activeTab === "evolution") {
            metricsStore.evolution.from = newDate;
        } else {
            metricsStore.from = newDate;
        }
    } else {
        if (departementMetricsStore.activeTab === "evolution") {
            metricsStore.evolution.to = newDate;
        } else {
            metricsStore.to = newDate;
        }
    }
};

function update() {
    trackEvent(
        "Visualisation des données nationales",
        "Changement dates",
        `${from.value.toLocaleDateString()} - ${to.value.toLocaleDateString()}`
    );
    if (departementMetricsStore.activeTab === "evolution") {
        metricsStore.evolution.from = from.value;
        metricsStore.evolution.to = to.value;
        metricsStore.fetchEvolution();
    } else {
        metricsStore.from = from.value;
        metricsStore.to = to.value;
        metricsStore.load();
    }
}
</script>
