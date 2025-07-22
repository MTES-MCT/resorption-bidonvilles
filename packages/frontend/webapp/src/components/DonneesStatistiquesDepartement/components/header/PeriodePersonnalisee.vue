<template>
    <div class="flex flex-col space-x-4 items-start my-4 pb-6 border-y-1">
        <div class="flex flex-row w-full justify-between">
            <p class="text-md font-bold py-4">Période personnalisée</p>
            <Icon class="mr-2 content-center" icon="angle-down" />
        </div>
        <div class="flex flex-row gap-4">
            <div>
                <p>Du</p>
                <DatepickerInput
                    withoutMargin
                    :maxDate="to"
                    name="from"
                    v-model="departementMetricsStore.evolution.from"
                    :disabled="departementMetricsStore.evolution.isLoading"
                />
            </div>
            <div>
                <p>Au</p>
                <DatepickerInput
                    withoutMargin
                    :minDate="from"
                    :maxDate="today"
                    name="to"
                    v-model="departementMetricsStore.evolution.to"
                    :disabled="departementMetricsStore.evolution.isLoading"
                />
            </div>

            <DsfrButton
                v-if="
                    !departementMetricsStore.evolution.isLoading &&
                    datesAreNotLoaded &&
                    values.from &&
                    values.to
                "
                @click="update"
                >Valider</DsfrButton
            >
        </div>
    </div>
</template>

<script setup>
import { toRefs, computed, watch } from "vue";
import { useForm } from "vee-validate";

import { DatepickerInput, Icon } from "@resorptionbidonvilles/ui";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store.js";
import updateDataRange from "../../utils/updateDataRange";

const props = defineProps({
    dateRange: { type: String, required: true },
});
const { dateRange } = toRefs(props);
const today = new Date();
const departementMetricsStore = useDepartementMetricsStore();

const { values } = useForm({
    initialValues: {
        from: new Date(departementMetricsStore.evolution.from),
        to: new Date(departementMetricsStore.evolution.to),
    },
});

const to = computed(() => {
    const todayMinor1 = new Date().setDate(today.getDate() - 1);
    const toMinor1 = new Date(departementMetricsStore.evolution.to).setDate(
        new Date(departementMetricsStore.evolution.to).getDate() - 1
    );

    return todayMinor1 < toMinor1 ? todayMinor1 : toMinor1;
});

const from = computed(() => {
    const fromPlus1 = new Date(departementMetricsStore.evolution.from).setDate(
        new Date(departementMetricsStore.evolution.from).getDate() + 1
    );

    return today < fromPlus1 ? today : fromPlus1;
});

const datesAreNotLoaded = computed(() => {
    if (
        !departementMetricsStore.evolution.loaded.from ||
        !departementMetricsStore.evolution.loaded.to
    ) {
        return true;
    }

    if (!values.from || !values.to) {
        return false;
    }

    return (
        values.from.toISOString().slice(0, 10) !==
            departementMetricsStore.evolution.loaded.from
                .toISOString()
                .slice(0, 10) ||
        values.to.toISOString().slice(0, 10) !==
            departementMetricsStore.evolution.loaded.to
                .toISOString()
                .slice(0, 10)
    );
});

const update = () => {
    updateDataRange(null, values.from, values.to);
};

watch(dateRange, () => {
    update();
});
</script>
