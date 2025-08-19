<template>
    <section class="flex space-x-3 items-end">
        <DatepickerInput
            name="from"
            :maxDate="toDate ? addDays(toDate, -1) : undefined"
            :label="
                departementMetricsStore.activeTab === 'evolution' ? 'De' : 'Du'
            "
            withoutMargin
            :section="departementMetricsStore.activeTab"
            :monthPicker="departementMetricsStore.activeTab === 'evolution'"
            @update:modelValue="(date) => updateDate('from', date)"
        />
        <DatepickerInput
            name="to"
            :minDate="fromDate ? addDays(fromDate, 1) : undefined"
            :maxDate="today"
            :label="
                departementMetricsStore.activeTab === 'evolution' ? 'À' : 'Au'
            "
            withoutMargin
            :section="departementMetricsStore.activeTab"
            :monthPicker="departementMetricsStore.activeTab === 'evolution'"
            @update:modelValue="(date) => updateDate('to', date)"
        />
        <DsfrButton
            @click="update"
            :loading="['init', 'refresh'].includes(metricsStore.nationStatus)"
            v-if="datesAreNotLoaded && fromDate && toDate"
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
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import { addDays, endOfMonth, isSameMonth } from "date-fns";

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

const fromDate = computed(() => toDateOrNull(from.value));
const toDate = computed(() => toDateOrNull(to.value));

const { setFieldValue } = useForm({
    initialValues: {
        from: fromDate.value,
        to: toDate.value,
    },
});

watchEffect(() => {
    setFieldValue("from", fromDate.value);
    setFieldValue("to", toDate.value);
});

function toDateOrNull(d) {
    if (!d) {
        return null;
    }
    if (d instanceof Date) {
        return isNaN(d.getTime()) ? null : d;
    }
    // Guard contre les strings vides ou invalides
    if (typeof d === 'string' && d.trim() === '') return null;
    const t = new Date(d);
    return isNaN(t.getTime()) ? null : t;
}

const datesAreNotLoaded = computed(() => {
    const ldFrom = toDateOrNull(metricsStore.loadedDates.from);
    const ldTo = toDateOrNull(metricsStore.loadedDates.to);
    const curFrom = fromDate.value;
    const curTo = toDate.value;

    if (!ldFrom || !ldTo) {
        return true;
    }
    if (!curFrom || !curTo) {
        return false;
    }

    const day = (dt) => dt.toISOString().slice(0, 10);
    return day(curFrom) !== day(ldFrom) || day(curTo) !== day(ldTo);
});

function normalizeFrom(d) {
    if (!d || !(d instanceof Date)) {
        return d;
    }
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function normalizeTo(d) {
    if (!d || !(d instanceof Date)) {
        return d;
    }
    // si on sélectionne le mois en cours, on arrête la période à la date de la veille
    const now = today.value;
    if (isSameMonth(d, now)) {
        return addDays(now, -1);
    }
    return endOfMonth(d);
}

const updateDate = (field, newDate) => {
    const isEvolution = departementMetricsStore.activeTab === "evolution";
    const target = isEvolution ? metricsStore.evolution : metricsStore;
    const d = toDateOrNull(newDate);

    if (field === "from") {
        target.from = isEvolution ? normalizeFrom(d) : d;
    } else {
        target.to = isEvolution ? normalizeTo(d) : d;
    }
};

function update() {
    trackEvent(
        "Visualisation des données nationales",
        "Changement dates",
        `${fromDate.value ? fromDate.value.toLocaleDateString() : ""} - ${
            toDate.value ? toDate.value.toLocaleDateString() : ""
        }`
    );
    if (departementMetricsStore.activeTab === "evolution") {
        metricsStore.evolution.from = fromDate.value;
        metricsStore.evolution.to = toDate.value;
        metricsStore.fetchEvolution();
    } else {
        metricsStore.from = fromDate.value;
        metricsStore.to = toDate.value;
        metricsStore.load();
    }
}
</script>
