<template>
    <header class="flex flex-col xl:flex-row lg:space-x-4 justify-between">
        <div class="flex space-x-4 items-end">
            <div>
                <p>Du</p>
                <DatepickerInput
                    withoutMargin
                    :maxDate="to"
                    v-model="from"
                    :disabled="departementMetricsStore.evolution.isLoading"
                />
            </div>
            <div>
                <p>Au</p>
                <DatepickerInput
                    withoutMargin
                    :minDate="from"
                    :maxDate="today"
                    v-model="to"
                    :disabled="departementMetricsStore.evolution.isLoading"
                />
            </div>

            <Button
                v-if="
                    !departementMetricsStore.evolution.isLoading &&
                    datesAreNotLoaded &&
                    from &&
                    to
                "
                @click="update"
                >Valider</Button
            >
        </div>
        <div class="hidden xl:block">
            <p>&nbsp;</p>
            <p class="flex space-x-4 items-center">
                <Button
                    variant="primaryOutline"
                    :disabled="departementMetricsStore.evolution.isLoading"
                    >L'année dernière</Button
                >
                <Button
                    variant="primaryOutline"
                    :disabled="departementMetricsStore.evolution.isLoading"
                    >Le mois dernier</Button
                >
                <Button
                    variant="primaryOutline"
                    :disabled="departementMetricsStore.evolution.isLoading"
                    >La semaine dernière</Button
                >
            </p>
        </div>
    </header>

    <div
        class="mt-12 text-center text-3xl text-primary"
        v-if="departementMetricsStore.evolution.isLoading"
    >
        <Spinner />
    </div>
    <ViewErrorInline
        class="mt-12"
        v-else-if="departementMetricsStore.evolution.error"
    >
        <template v-slot:title
            >Les données d'évolution n'ont pas pu être chargées</template
        >
        <template v-slot:code>{{
            departementMetricsStore.evolution.error
        }}</template>
    </ViewErrorInline>
    <div class="mt-6" v-else>
        <component :is="currentTabComponent" />
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { Button, DatepickerInput, Spinner } from "@resorptionbidonvilles/ui";
import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import EvolutionChartTabSummary from "./EvolutionChartTabSummary.vue";
import EvolutionChartTabInhabitants from "./EvolutionChartTabInhabitants.vue";
import EvolutionChartTabLivingConditions from "./EvolutionChartTabLivingConditions.vue";
import EvolutionChartTabJustice from "./EvolutionChartTabJustice.vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

const departementMetricsStore = useDepartementMetricsStore();
const tabs = {
    summary: EvolutionChartTabSummary,
    inhabitants: EvolutionChartTabInhabitants,
    livingConditions: EvolutionChartTabLivingConditions,
    justice: EvolutionChartTabJustice,
};

const currentTabComponent = computed(() => {
    return tabs[departementMetricsStore.activeTab];
});

const today = ref(new Date());

const from = ref(new Date(departementMetricsStore.evolution.from));
const to = ref(new Date(departementMetricsStore.evolution.to));

const datesAreNotLoaded = computed(() => {
    if (
        !departementMetricsStore.evolution.loaded.from ||
        !departementMetricsStore.evolution.loaded.to
    ) {
        return true;
    }

    if (!from.value || !to.value) {
        return false;
    }

    return (
        from.value.toISOString().slice(0, 10) !==
            departementMetricsStore.evolution.loaded.from
                .toISOString()
                .slice(0, 10) ||
        to.value.toISOString().slice(0, 10) !==
            departementMetricsStore.evolution.loaded.to
                .toISOString()
                .slice(0, 10)
    );
});

function update() {
    departementMetricsStore.evolution.from = from.value;
    departementMetricsStore.evolution.to = to.value;
    departementMetricsStore.fetchEvolution(departementMetricsStore.departement);
}
</script>
